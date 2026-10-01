import { NextResponse } from "next/server";
import { Resend } from "resend";
import { leadSchema, type LeadData } from "@/lib/schemas";
import { neighborhoodName } from "~/content/neighborhoods";

/* ---------- Simple in-memory rate limit (per server instance) ---------- */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
  }
  return recent.length > MAX_REQUESTS;
}

const labels = {
  evaluation: "طلب تقييم شقة",
  contact: "رسالة تواصل",
  furnished: { yes: "مفروشة", partly: "مفروشة جزئياً", no: "غير مفروشة" },
  service: { cleaning: "تنظيف فقط", management: "إدارة شاملة", management_plus: "إدارة شاملة بلس", not_sure: "غير متأكد" },
  topic: { owner: "مالك شقة", guest: "ضيف", other: "استفسار عام" },
} as const;

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function toRows(data: LeadData): [string, string][] {
  if (data.type === "evaluation") {
    return [
      ["الاسم", data.name],
      ["الجوال", data.phone],
      ["الحي", data.neighborhood === "other" ? "حي آخر" : neighborhoodName(data.neighborhood, "ar")],
      ["عدد الغرف", data.bedrooms],
      ["التأثيث", labels.furnished[data.furnished]],
      ["الخدمة", labels.service[data.service]],
      ["ملاحظات", data.notes || "—"],
      ["لغة الموقع", data.locale ?? "ar"],
    ];
  }
  return [
    ["الاسم", data.name],
    ["الجوال", data.phone],
    ["الإيميل", data.email || "—"],
    ["الموضوع", labels.topic[data.topic]],
    ["الرسالة", data.message],
    ["لغة الموقع", data.locale ?? "ar"],
  ];
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rateLimit" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "generic" }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. Pretend success, do nothing.
  if (body && typeof body === "object" && "company_website" in body && (body as Record<string, unknown>).company_website) {
    return NextResponse.json({ ok: true });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "validation", issues: parsed.error.issues.map((i) => i.path.join(".")) }, { status: 400 });
  }

  const data = parsed.data;
  const rows = toRows(data);
  const subject = `${labels[data.type]} — ${data.name}`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `<div dir="rtl" style="font-family:Arial,sans-serif;font-size:15px;color:#14181F">
    <h2 style="color:#0F3D3E;margin:0 0 16px">${escapeHtml(subject)}</h2>
    <table cellpadding="8" style="border-collapse:collapse">${rows
      .map(
        ([k, v]) =>
          `<tr><td style="background:#F6F3EE;font-weight:bold;vertical-align:top">${escapeHtml(k)}</td><td style="white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
      )
      .join("")}</table>
    <p style="margin-top:16px"><a href="https://wa.me/966${data.phone.slice(1)}">راسله على واتساب</a></p>
  </div>`;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.info(`[lead] RESEND_API_KEY not set — logging lead instead of emailing:\n${subject}\n${text}`);
    return NextResponse.json({ ok: true, delivered: "log" });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.LEADS_FROM_EMAIL || "Clees <onboarding@resend.dev>",
      to: (process.env.LEADS_TO_EMAIL || "hello@clees.sa").split(",").map((s) => s.trim()),
      subject,
      text,
      html,
      ...(data.type === "contact" && data.email ? { replyTo: data.email } : {}),
    });
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true, delivered: "email" });
  } catch (err) {
    // Never lose a lead: log it so it can be recovered from the server logs.
    console.error("[lead] email failed, lead logged below", err);
    console.info(`[lead] ${subject}\n${text}`);
    return NextResponse.json({ ok: false, error: "generic" }, { status: 502 });
  }
}

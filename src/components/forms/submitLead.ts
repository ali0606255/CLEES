export type SubmitResult = { ok: true } | { ok: false; error: "generic" | "rateLimit" };

export async function submitLead(payload: unknown): Promise<SubmitResult> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.status === 429) return { ok: false, error: "rateLimit" };
    const json = (await res.json().catch(() => ({}))) as { ok?: boolean };
    return json.ok ? { ok: true } : { ok: false, error: "generic" };
  } catch {
    return { ok: false, error: "generic" };
  }
}

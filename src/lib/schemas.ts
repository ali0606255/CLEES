// zod/mini keeps the client bundle small (same validation rules, tree-shakable API)
import * as z from "zod/mini";
import { normalizeSaudiPhone } from "@/lib/utils";
import { serviceIds } from "~/content/packages";

/** Error messages are translation keys under form.errors.* */
const name = z.string().check(z.trim(), z.minLength(2, "name"), z.maxLength(80, "name"));
const phone = z.pipe(
  z.pipe(z.string(), z.transform(normalizeSaudiPhone)),
  z.string().check(z.regex(/^05\d{8}$/, "phone")),
);
const honeypot = z.optional(z.string());
const locale = z.optional(z.enum(["ar", "en"]));

export const bedroomOptions = ["1", "2", "3", "4", "5+"] as const;
export const furnishedOptions = ["yes", "partly", "no"] as const;
export const topicOptions = ["owner", "guest", "other"] as const;

export const evaluationSchema = z.object({
  type: z.literal("evaluation"),
  name,
  phone,
  neighborhood: z.string().check(z.minLength(1, "required"), z.maxLength(60)),
  bedrooms: z.enum(bedroomOptions, { error: "required" }),
  furnished: z.enum(furnishedOptions, { error: "required" }),
  service: z.enum(serviceIds, { error: "required" }),
  notes: z.optional(z.string().check(z.trim(), z.maxLength(1500))),
  company_website: honeypot,
  locale,
});

export const contactSchema = z.object({
  type: z.literal("contact"),
  name,
  phone,
  email: z.optional(z.union([z.literal(""), z.email("email")])),
  topic: z.enum(topicOptions, { error: "required" }),
  message: z.string().check(z.trim(), z.minLength(10, "message"), z.maxLength(3000, "message")),
  company_website: honeypot,
  locale,
});

export const leadSchema = z.discriminatedUnion("type", [evaluationSchema, contactSchema]);

export type EvaluationInput = z.input<typeof evaluationSchema>;
export type EvaluationData = z.output<typeof evaluationSchema>;
export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;
export type LeadData = z.output<typeof leadSchema>;

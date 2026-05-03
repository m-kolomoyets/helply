import { z } from "zod"

const HAS_SCHEME = /^[a-z][a-z0-9+\-.]*:\/\//i

function normalizeUrl(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return trimmed
  return HAS_SCHEME.test(trimmed) ? trimmed : `https://${trimmed}`
}

export const urlFieldSchema = z
  .string()
  .min(1, { error: () => "URL is required" })
  .transform(normalizeUrl)
  .pipe(z.url({ error: () => "Enter a valid URL" }))

export const qrFormSchema = z.object({
  url: urlFieldSchema,
})

export type QrFormValues = z.infer<typeof qrFormSchema>

export const qrSearchSchema = z.object({
  url: z.string().optional(),
})

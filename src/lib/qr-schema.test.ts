import { describe, expect, it } from "vitest"

import { urlFieldSchema } from "./qr-schema"

describe("urlFieldSchema", () => {
  it("accepts an https URL as-is", () => {
    expect(urlFieldSchema.parse("https://example.com")).toBe(
      "https://example.com"
    )
  })

  it("accepts an http URL as-is", () => {
    expect(urlFieldSchema.parse("http://example.com/path?q=1")).toBe(
      "http://example.com/path?q=1"
    )
  })

  it("auto-prepends https:// when scheme missing", () => {
    expect(urlFieldSchema.parse("example.com")).toBe("https://example.com")
    expect(urlFieldSchema.parse("sub.example.com/path")).toBe(
      "https://sub.example.com/path"
    )
  })

  it("preserves non-http schemes with ://", () => {
    expect(urlFieldSchema.parse("ftp://files.example.com")).toBe(
      "ftp://files.example.com"
    )
  })

  it("trims whitespace before validating", () => {
    expect(urlFieldSchema.parse("  example.com  ")).toBe("https://example.com")
  })

  it("rejects empty string", () => {
    const res = urlFieldSchema.safeParse("")
    expect(res.success).toBe(false)
  })

  it("rejects whitespace-only", () => {
    const res = urlFieldSchema.safeParse("   ")
    expect(res.success).toBe(false)
  })

  it("rejects garbage that cannot be parsed as URL", () => {
    const res = urlFieldSchema.safeParse("not a url at all")
    expect(res.success).toBe(false)
  })

  it("rejects bare 'http://' with no host", () => {
    const res = urlFieldSchema.safeParse("http://")
    expect(res.success).toBe(false)
  })
})

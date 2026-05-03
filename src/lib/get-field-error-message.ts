type FieldError = string | { message?: string } | undefined | null

export function getFieldErrorMessage(errors: Array<FieldError>): string | null {
  for (const err of errors) {
    if (!err) continue
    if (typeof err === "string") return err
    if (typeof err === "object" && typeof err.message === "string")
      return err.message
  }
  return null
}

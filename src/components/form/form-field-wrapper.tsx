import * as React from "react"

import { useFieldContext } from "./form-context"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { getFieldErrorMessage } from "@/lib/get-field-error-message"

type FormFieldWrapperProps = React.PropsWithChildren<{
  className?: string
  label?: React.ReactNode
  labelClassName?: string
}>

function FormFieldWrapper({
  className,
  label,
  labelClassName,
  children,
}: FormFieldWrapperProps) {
  const field = useFieldContext<unknown>()
  const errorMessage = getFieldErrorMessage(field.state.meta.errors)
  const id = `${field.name}${field.form.formId}`

  return (
    <div
      className={cn("flex flex-col gap-1.5", className)}
      data-invalid={!!errorMessage || undefined}
    >
      {label !== undefined ? (
        <Label htmlFor={id} className={labelClassName}>
          {label}
        </Label>
      ) : null}
      {children}
      {errorMessage ? (
        <p className="text-xs text-destructive">{errorMessage}</p>
      ) : null}
    </div>
  )
}

export { FormFieldWrapper }

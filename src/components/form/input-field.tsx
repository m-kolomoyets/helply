import * as React from "react"

import { useFieldContext } from "./form-context"
import { Input } from "@/components/ui/input"
import { getFieldErrorMessage } from "@/lib/get-field-error-message"

type InputFieldProps = Omit<
  React.ComponentProps<typeof Input>,
  "name" | "id" | "value" | "aria-invalid"
>

function InputField({ onChange, onBlur, ...props }: InputFieldProps) {
  const field = useFieldContext<string>()
  const errorMessage = getFieldErrorMessage(field.state.meta.errors)
  const id = `${field.name}${field.form.formId}`

  return (
    <Input
      id={id}
      name={field.name}
      aria-invalid={!!errorMessage || undefined}
      value={field.state.value}
      onChange={(e) => {
        field.handleChange(e.target.value)
        onChange?.(e)
      }}
      onBlur={(e) => {
        field.handleBlur()
        onBlur?.(e)
      }}
      {...props}
    />
  )
}

export { InputField }

import { createFormHook } from "@tanstack/react-form"

import { fieldContext, formContext } from "./form-context"
import { FormFieldWrapper } from "./form-field-wrapper"
import { InputField } from "./input-field"

const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    FormFieldWrapper,
    InputField,
  },
  formComponents: {},
})

export { useAppForm, withForm, withFieldGroup }

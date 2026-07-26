import type { MaybeRefOrGetter } from 'vue'

import type { Rule } from './validation'

export interface ValidationErrorPayload {
  errorMessage: string
  uid: string
}

export interface UseValidateOptions {
  /** Динамическое отключение валидации поля */
  disabled?: MaybeRefOrGetter<boolean>
  error?: MaybeRefOrGetter<boolean>
  errorMessage?: MaybeRefOrGetter<string>
  immediate?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rules?: MaybeRefOrGetter<Rule<any>[]>
  timeout?: number

  onValidationError?: (payload: ValidationErrorPayload) => void
}

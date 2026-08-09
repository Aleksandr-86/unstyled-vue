import type { InjectionKey, Ref } from 'vue'

export interface FormContext {
  registerFormField(
    uid: string,
    isValidating: Ref<boolean>,
    clearField: () => void,
    focus: () => void,
    resetError: () => void,
    validate: () => Promise<boolean>,
  ): void
  unregisterFormField(uid: string): void
}

export const FormContextKey: InjectionKey<FormContext> = Symbol('FormContext')

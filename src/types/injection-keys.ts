import type { InjectionKey, Ref } from 'vue'

export interface FormContext {
  registerFormField(
    uid: string,
    validateFn: () => Promise<boolean>,
    resetFn: () => void,
    isValidatingRef: Ref<boolean>,
    focusFn: () => void,
  ): void
  unregisterFormField(uid: string): void
}

export const FormContextKey: InjectionKey<FormContext> = Symbol('FormContext')

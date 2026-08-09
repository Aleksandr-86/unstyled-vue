import type { Ref } from 'vue'
import { provide, ref } from 'vue'

import { FormContextKey } from '../types/injection-keys'

interface RegisteredField {
  /** Флаг, указывающий, что поле находится в процессе валидации */
  isValidating: Ref<boolean>

  /** Флаг, указывающий, что поле находится в процессе валидации */
  clearField: () => void
  /** Фокусировка на поле */
  focus: () => void
  /** Сброс ошибки валидации */
  resetError: () => void
  /** Валидация поля */
  validate: () => Promise<boolean>
}

interface UseFormReturn {
  /**
   * Флаг, указывающий, что форма находится в процессе валидации
   * (Flag indicating that the form is currently validating)
   */
  isFormValidating: Ref<boolean>

  /**
   * Сброс ошибок валидации и очистка полей формы
   * (Resets validation errors and clears form fields)
   */
  clearForm: () => void
  /**
   * Сброс ошибок валидации для всех полей формы
   * (Resets validation errors for all form fields)
   */
  resetErrors: () => void
  /**
   * Валидация полей формы
   * (Validates form fields)
   */
  validateForm: () => Promise<boolean>
}

export function useForm(): UseFormReturn {
  const formFields: Record<string, RegisteredField> = {}
  const isFormValidating = ref(false)

  function registerFormField(
    uid: string,
    isValidating: Ref<boolean>,
    clearField: () => void,
    focus: () => void,
    resetError: () => void,
    validate: () => Promise<boolean>,
  ) {
    formFields[uid] = {
      isValidating,
      clearField,
      focus,
      resetError,
      validate,
    }
  }

  function unregisterFormField(uid: string): void {
    delete formFields[uid]
  }

  async function validateForm(): Promise<boolean> {
    // Защита от повторной валидации формы
    if (isFormValidating.value) return false
    isFormValidating.value = true

    const fieldEntries = Object.entries(formFields)
    const promises = fieldEntries.map((entry) => entry[1].validate())

    try {
      const results = await Promise.all(promises)

      /** Массив полей проваливших валидацию */
      const failedUids = fieldEntries.filter((_, index) => results[index] === false).map(([uid]) => uid)

      if (failedUids.length > 0) {
        // Поиск всех элементов на странице, соответствующих ошибочным uid
        const elements = failedUids
          .map((uid) => document.getElementById(uid))
          .filter((el): el is HTMLElement => el instanceof HTMLElement && el.isConnected)

        if (elements.length > 0) {
          // Сортировка элементов по их фактическому положению в ОМД (сверху вниз)
          elements.sort((a, b) => {
            // Безопасная проверка позиции
            const position = a.compareDocumentPosition(b)
            if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1
            if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1
            return 0
          })

          const firstFailedElement = elements[0]
          if (firstFailedElement) {
            formFields[firstFailedElement.id]?.focus()
          }
        }
      }

      return results.every((result) => result === true)
    } finally {
      isFormValidating.value = false
    }
  }

  function resetErrors(): void {
    Object.values(formFields).forEach((field) => field.resetError())
  }

  function clearForm(): void {
    Object.values(formFields).forEach((field) => field.clearField())
  }

  provide(FormContextKey, {
    registerFormField,
    unregisterFormField,
  })

  return { isFormValidating, clearForm, resetErrors, validateForm }
}

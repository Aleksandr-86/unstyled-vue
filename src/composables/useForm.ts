import { provide, type Ref, ref } from 'vue'

import { FormContextKey } from '../types/injection-keys'

interface RegisteredField {
  isValidating: Ref<boolean>

  clearField: () => void
  focus: () => void
  resetError: () => void
  validate: () => Promise<boolean>
}

interface UseFormReturn {
  /**
   * Флаг, указывающий, что форма находится в процессе валидации
   */
  isSubmitting: Ref<boolean>

  /**
   * Сброс ошибок валидации и вызов функций очистки полей формы
   */
  clearForm: () => void
  /**
   * Сброс ошибок валидации для всех полей формы
   */
  resetErrors: () => void
  /**
   * Главный метод валидации всей формы с автофокусом
   */
  validateForm: () => Promise<boolean>
}

export function useForm(): UseFormReturn {
  const formFields = ref<Record<string, RegisteredField>>({})
  const isSubmitting = ref(false)

  // const isFormValidating = computed(() => {
  //   return Object.values(formFields.value).some((field) => field.isValidating.value)
  // })

  function registerFormField(
    uid: string,
    isValidating: Ref<boolean>,
    clearField: () => void,
    focus: () => void,
    resetError: () => void,
    validate: () => Promise<boolean>,
  ) {
    formFields.value[uid] = {
      isValidating,
      clearField,
      focus,
      resetError,
      validate,
    }
  }

  function unregisterFormField(uid: string): void {
    delete formFields.value[uid]
  }

  async function validateForm(): Promise<boolean> {
    // Защита от повторной валидации формы
    // if (isSubmitting.value) return false

    isSubmitting.value = true

    const fieldEntries = Object.entries(formFields.value)
    const promises = fieldEntries.map((entry) => entry[1].validate())

    try {
      const results = await Promise.all(promises)

      /** Массив полей проваливших валидацию */
      const failedUids = fieldEntries.filter((_, index) => results[index] === false).map(([uid]) => uid)

      if (failedUids.length > 0) {
        // Поиск всех элементов на странице, соответствующих ошибочным uid
        const elements = failedUids
          .map((uid) => document.getElementById(uid))
          .filter((el): el is HTMLElement => el !== null && el.isConnected)

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
            formFields.value[firstFailedElement.id]?.focus()
          }
        }
      }

      return results.every((result) => result === true)
    } finally {
      isSubmitting.value = false
    }
  }

  function resetErrors(): void {
    Object.values(formFields.value).forEach((field) => field.resetError())
  }

  function clearForm(): void {
    Object.values(formFields.value).forEach((field) => field.clearField())
  }

  provide(FormContextKey, {
    registerFormField,
    unregisterFormField,
  })

  return { isSubmitting, clearForm, resetErrors, validateForm }
}

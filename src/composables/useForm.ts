import { computed, provide, type Ref, ref } from 'vue'

import { FormContextKey } from '../types/injection-keys'

interface RegisteredField {
  isValidating: Ref<boolean>

  focus: () => void
  reset: () => void
  validate: () => Promise<boolean>
}

export function useForm() {
  const formFields = ref<Record<string, RegisteredField>>({})
  const isSubmitting = ref(false)

  const isFormValidating = computed(() => {
    return Object.values(formFields.value).some((field) => field.isValidating.value)
  })

  function registerFormField(
    uid: string,
    validateFn: () => Promise<boolean>,
    resetFn: () => void,
    isValidatingRef: Ref<boolean>,
    focusFn: () => void,
  ) {
    formFields.value[uid] = {
      validate: validateFn,
      reset: resetFn,
      focus: focusFn,
      isValidating: isValidatingRef,
    }
  }

  function unregisterFormField(uid: string): void {
    delete formFields.value[uid]
  }

  /** Главный метод валидации всей формы с автофокусом */
  async function validateForm(): Promise<boolean> {
    // Защита от повторной валидации формы
    if (isSubmitting.value) return false

    isSubmitting.value = true

    const fieldEntries = Object.entries(formFields.value)
    const promises = fieldEntries.map((entry) => entry[1].validate())

    try {
      // Параллельный запуск всех проверок
      const results = await Promise.all(promises)

      // Создание массива uid полей, которые провалили валидацию
      const failedUids = fieldEntries.filter((_, index) => results[index] === false).map(([uid]) => uid)

      if (failedUids.length > 0) {
        // Поиск всех элементов на странице, соответствующих ошибочным uid
        const elements = failedUids
          .map((uid) => document.getElementById(uid))
          .filter((el): el is HTMLElement => el !== null && el.isConnected) // ИСПРАВЛЕНО: Проверяем, что элемент всё ещё в DOM

        if (elements.length > 0) {
          // Сортировка элементов по их фактическому положению в DOM (сверху вниз)
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

  function resetForm(): void {
    Object.values(formFields.value).forEach((field) => field.reset())
  }

  provide(FormContextKey, {
    registerFormField,
    unregisterFormField,
  })

  return { isSubmitting, isFormValidating, validateForm, resetForm }
}

import {
  computed,
  type ComputedRef,
  inject,
  type MaybeRefOrGetter,
  onUnmounted,
  type Ref,
  ref,
  toValue,
  useId,
  watch,
} from 'vue'

import type { UseValidateOptions } from '../types/common-types'
import { FormContextKey } from '../types/injection-keys'

interface UseValidateReturn {
  /**
   * Вычисляемое свойство отражающее факт наличия ошибки
   * (A computed property that reflects the presence of an error)
   */
  errExist: ComputedRef<boolean>
  /**
   * Вычисляемое свойство отображающее сообщение об ошибке
   * (A computed property that displays an error message)
   */
  errMessage: ComputedRef<string | undefined>
  /**
   * Реактивная переменная для отслеживания процесса валидации
   * (Reactive variable for tracking the validation process)
   */
  isValidating: Ref<boolean>
  /**
   * Уникальный идентификатор
   * (Unique identifier)
   */
  uid: string

  /**
   * Функция сброса результатов проверки.
   * (The function of resetting the test results)
   */
  reset(): void
  /**
   * Асинхронная функция инициирующая валидацию полей. Успешная валидация возвращает true. Не успешная - объект типа ValidationError.
   * (Asynchronous function that initiates field validation. Successful validation returns true. Failed - an object of the ValidationError type.)
   */
  validate(): Promise<boolean>
}

/**
 * @ru
 * Составная функция для последовательной валидации полей.
 *
 * @param model - Модель целевого компонента.
 * @param options - Параметры.
 *
 * @en
 * A composable function for sequential field validation.
 *
 * @param model - Target component model.
 * @param options - Parameters.
 */
export function useValidateSeq<T = unknown>(
  model: MaybeRefOrGetter<T>,
  options: UseValidateOptions = {},
): UseValidateReturn {
  const uid = useId()
  const formContext = inject(FormContextKey, null)
  const timeoutMs = options.timeout?.ms

  const isValidating = ref(false)

  const internalErrExist = ref(false)
  const internalErrMessage = ref('')

  const errExist = computed(() => {
    if (toValue(options.disabled)) {
      return false
    }

    const externalError = toValue(options.error)
    return externalError || internalErrExist.value
  })

  const errMessage = computed(() => {
    if (toValue(options.disabled)) {
      return ''
    }

    const externalError = toValue(options.error)
    const externalMessage = toValue(options.errorMessage)

    if (externalError) {
      return externalMessage || ''
    }

    return internalErrMessage.value
  })

  watch(
    () => options.disabled,
    () => {
      if (toValue(options.disabled)) {
        reset()
      }
    },
  )

  function invokeValidationError(message: string | undefined) {
    if (toValue(options.disabled)) return

    internalErrExist.value = true
    internalErrMessage.value = message || ''

    if (options.onValidationError) {
      options.onValidationError({ uid, errorMessage: message || '' })
    }
  }

  async function validate(): Promise<boolean> {
    if (toValue(options.disabled)) {
      return true
    }

    isValidating.value = true
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    try {
      const externalError = toValue(options.error)

      if (externalError === true) {
        const externalMessage = toValue(options.errorMessage)
        invokeValidationError(externalMessage)
        return false
      }

      const currentRules = toValue(options.rules) || []

      for (const rule of currentRules) {
        try {
          const rulePromise = Promise.resolve(rule(toValue(model)))
          let result: string | boolean | void

          if (typeof timeoutMs === 'number' && timeoutMs > 0) {
            const timeoutPromise = new Promise<string | boolean | void>((_, reject) => {
              timeoutId = setTimeout(() => reject(new Error('[Unstyled-vue]: Timeout.')), timeoutMs)
            })

            result = await Promise.race([rulePromise, timeoutPromise])

            if (timeoutId) {
              clearTimeout(timeoutId)
            }
          } else {
            result = await rulePromise
          }

          if (toValue(options.disabled)) {
            return true
          }

          if (result === false || typeof result === 'string') {
            invokeValidationError(result === false ? '' : result)
            return false
          }
        } catch (error: unknown) {
          if (timeoutId) {
            clearTimeout(timeoutId)
          }

          if (toValue(options.disabled)) {
            return true
          }

          if (error instanceof Error) {
            invokeValidationError(
              error.message === '[Unstyled-vue]: Timeout.'
                ? options.timeout?.message
                : '[Unstyled-vue]: An error occurred during validation.',
            )
          } else {
            invokeValidationError('[Unstyled-vue]: Unknown error during validation.')
          }

          return false
        }
      }

      internalErrExist.value = false
      internalErrMessage.value = ''
      return true
    } finally {
      isValidating.value = false
    }
  }

  if (options.immediate) {
    validate()
  }

  function reset() {
    internalErrExist.value = false
    internalErrMessage.value = ''
    isValidating.value = false
  }

  if (formContext) {
    const focus = () => {
      const el = document.getElementById(uid)

      if (el) {
        el.focus()
      }
    }

    formContext.registerFormField(uid, validate, reset, isValidating, focus)
    onUnmounted(() => formContext.unregisterFormField(uid))
  }

  return {
    uid,
    errExist,
    errMessage,
    isValidating,
    validate,
    reset,
  }
}

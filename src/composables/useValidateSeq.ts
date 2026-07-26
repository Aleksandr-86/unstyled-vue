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
  watchEffect,
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
  errMessage: ComputedRef<string>
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
   * Асинхронная функция инициирующая валидацию полей
   * (An asynchronous function that initiates field validation)
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
  const timeoutMs = options.timeout

  const isValidating = ref(false)

  const internalErrExist = ref(false)
  const internalErrMessage = ref('')

  const errExist = computed(() => {
    if (toValue(options.disabled)) return false

    const externalError = toValue(options.error)
    return externalError ?? internalErrExist.value
  })

  const errMessage = computed(() => {
    if (toValue(options.disabled)) return ''

    const externalError = toValue(options.error)
    const externalMessage = toValue(options.errorMessage)

    if (externalError) {
      return externalMessage || 'Ошибка валидации (внешняя)'
    }

    return internalErrMessage.value
  })

  watchEffect(() => {
    if (toValue(options.disabled)) {
      reset()
    }
  })

  function invokeValidationError(message: string) {
    if (toValue(options.disabled)) return

    internalErrExist.value = true
    internalErrMessage.value = message

    if (options.onValidationError) {
      options.onValidationError({ uid, errorMessage: message })
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
        invokeValidationError(externalMessage || 'Ошибка валидации (внешняя)')
        return false
      }

      const currentRules = toValue(options.rules) || []

      for (const rule of currentRules) {
        try {
          const rulePromise = Promise.resolve(rule(toValue(model)))
          let result: string | boolean | void

          if (typeof timeoutMs === 'number' && timeoutMs > 0) {
            const timeoutPromise = new Promise<string | boolean | void>((_, reject) => {
              timeoutId = setTimeout(() => reject(new Error('Validation timeout')), timeoutMs)
            })

            result = await Promise.race([rulePromise, timeoutPromise])

            if (timeoutId) clearTimeout(timeoutId)
          } else {
            result = await rulePromise
          }

          if (toValue(options.disabled)) return true

          if (result === false || typeof result === 'string') {
            invokeValidationError(typeof result === 'string' ? result : 'Неверное значение')
            return false
          }
        } catch (error: unknown) {
          if (timeoutId) clearTimeout(timeoutId)
          if (toValue(options.disabled)) return true

          if (error instanceof Error) {
            invokeValidationError(
              error.message === 'Validation timeout'
                ? `Превышено время ожидания проверки (${timeoutMs}мс)`
                : 'Ошибка при выполнении проверки',
            )
          } else {
            invokeValidationError('Неизвестная ошибка при выполнении проверки')
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
      if (el) el.focus()
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

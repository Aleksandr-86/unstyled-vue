import type { MaybeRefOrGetter } from 'vue'

export interface ValidationError {
  /**
   * Текст сообщения об ошибке
   * (Error message text)
   */
  errorMessage: string
  /**
   * Уникальный идентификатор
   * (Unique identifier)
   */
  uid: string
}

/**
 * Правило
 * (Rule)
 */
export type Rule<T = unknown> = (value: T, signal?: AbortSignal) => string | boolean | Promise<string | boolean>

export interface UseValidateOptions {
  /**
   * Флаг отключения валидации
   * (Disables validation if true)
   */
  disabled?: MaybeRefOrGetter<boolean>
  /**
   * Флаг наличия внешней ошибки
   * (Indicates an external error if true)
   */
  error?: MaybeRefOrGetter<boolean>
  /**
   * Текст сообщения внешней ошибки
   * (External error message text)
   */
  errorMessage?: MaybeRefOrGetter<string>
  /**
   * Запуск валидации сразу при монтировании компонента
   * (Triggers validation immediately upon mounting)
   */
  immediate?: boolean
  /**
   * Массив правил для проверки
   * (Array of validation rules)
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rules?: MaybeRefOrGetter<Rule<any>[]>
  /**
   * Максимальное время ожидания проверки и пользовательское сообщение об ошибке
   * (Maximum validation timeout and custom error message)
   */
  timeout?: {
    ms: number
    message?: string
  }

  /**
   * Функция, вызываемая при сбросе значений элемента формы
   */
  onResetValue?: () => void
  /**
   * Функция, вызываемая при возникновении ошибки валидации
   * (Callback function invoked when a validation error occurs)
   */
  onValidationError?: (payload: ValidationError) => void
}

import type { BaseFieldProps } from '../../types/base-props.ts'

export { default as BaseTextarea } from './BaseTextarea.vue'

// #region base-textarea-model
export type BaseTextareaModel = string | number | null
// #endregion base-textarea-model

export interface BaseTextareaProps extends BaseFieldProps {
  /**
   * Автоматическое исправление орфографических ошибок
   * (Automatic correction of spelling errors)
   */
  autocorrect?: 'on' | 'off'
  /**
   * Количество видимых строк области текста
   * (The number of visible text lines for the textarea)
   */
  rows?: number
}

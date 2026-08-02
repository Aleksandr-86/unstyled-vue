import type { BaseFieldProps } from '../../types/base-props'

export { default as BaseInput } from './BaseInput.vue'

// #region base-input-model
export type BaseInputModel = string | number | null
// #endregion base-input-model

export interface BaseInputProps extends BaseFieldProps {
  /**
   * Максимальное значение
   * Max value
   */
  max?: number
  /**
   * Минимальное значение
   * Min value
   */
  min?: number
  /**
   * Тип
   * Type
   */
  type?: string
}

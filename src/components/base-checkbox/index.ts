export { default as BaseCheckbox } from './BaseCheckbox.vue'

// #region checkbox-item
export type CheckboxItem = string | number | boolean | Record<string, unknown> | null
// #endregion checkbox-item

export interface BaseCheckboxProps<T extends CheckboxItem = boolean> {
  /**
   * Идентификатор элемента (например, подсказки или ошибки), описывающего данное поле выбора
   * (Identifier of the element [e.g., hint or error] describing this checkbox)
   */
  ariaDescribedby?: string
  /**
   * Состояние ошибки/невалидности для программ экранного доступа
   * (Invalid state for screen readers)
   */
  ariaInvalid?: boolean | 'grammar' | 'spelling'
  /**
   * Текстовая строка, описывающая элемент для программ экранного доступа (когда визуальный текст отсутствует или недостаточен)
   * (A text string that labels the element for screen readers [used when the visual label is missing or insufficient])
   */
  ariaLabel?: string
  /**
   * Классы компонента
   * (Component classes)
   */
  classes?: {
    root?: string
    input?: string
    label?: string
  }
  /**
   * Состояние "отключено"
   * (Disabled state)
   */
  disabled?: boolean
  /**
   * Ложное значение
   * (False value)
   */
  falseValue?: T
  /**
   * Метка
   * (Label)
   */
  label?: string
  /**
   * Имя
   * (Name)
   */
  name?: string
  /**
   * Состояние "только для чтения"
   * (Read-only state)
   */
  readonly?: boolean
  /**
   * Обязательное поле
   * (Required field)
   */
  required?: boolean
  /**
   * Истинное значение
   * (True value)
   */
  trueValue?: T
  /**
   * Значение поля выбора, добавляемое в массив модели (в режиме группы)
   * (The value of the checkbox added to the model array [in group mode])
   */
  value?: T
}

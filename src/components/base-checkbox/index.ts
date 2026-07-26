export { default as BaseCheckbox } from './BaseCheckbox.vue'

// #region checkbox-item
export type CheckboxItem = string | number | boolean | Record<string, unknown> | null
// #endregion checkbox-item

export interface BaseCheckboxProps<T extends CheckboxItem = boolean> {
  /**
   * @ru Идентификатор элемента (например, подсказки или ошибки), описывающего данное поле выбора
   * @en Identifier of the element (e.g., hint or error) describing this checkbox
   */
  ariaDescribedby?: string
  /**
   * @ru Состояние ошибки/невалидности для программ экранного доступа
   * @en Invalid state for screen readers
   */
  ariaInvalid?: boolean | 'grammar' | 'spelling'
  /**
   * @ru Текстовая строка, описывающая элемент для программ экранного доступа (когда визуальный текст отсутствует или недостаточен).
   * @en A text string that labels the element for screen readers (used when the visual label is missing or insufficient).
   */
  ariaLabel?: string
  /**
   * @ru Классы компонента
   * @en Component classes
   */
  classes?: {
    root?: string
    input?: string
    label?: string
  }
  /**
   * @ru Состояние "отключено"
   * @en Disabled state
   */
  disabled?: boolean
  /**
   * @ru Ложное значение
   * @en False value
   */
  falseValue?: T
  /**
   * @ru Метка
   * @en Label
   */
  label?: string
  /**
   * @ru Имя
   * @en Name
   */
  name?: string
  /**
   * @ru Состояние "только для чтения"
   * @en Read-only state
   */
  readonly?: boolean
  /**
   * @ru Обязательное поле
   * @en Required field
   */
  required?: boolean
  /**
   * @ru Истинное значение
   * @en True value
   */
  trueValue?: T
  /**
   * @ru Значение поля выбора, добавляемое в массив модели (в режиме группы)
   * @en The value of the checkbox added to the model array (in group mode)
   */
  value?: T
}

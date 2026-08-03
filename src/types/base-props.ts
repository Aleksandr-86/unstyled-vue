export interface BaseFieldProps {
  /**
   * Автозаполнение
   * (Autocomplete)
   */
  autocomplete?: string
  /**
   * Состояние "отключено"
   * (Disabled state)
   */
  disabled?: boolean
  /**
   * Идентификатор
   * (Identifier)
   */
  id?: string
  /**
   * Максимальная длина строки
   * (Maximum string length)
   */
  maxlength?: number
  /**
   * Минимальная длина строки
   * (Minimum string length)
   */
  minlength?: number
  /**
   * Имя
   * (Name)
   */
  name?: string
  /**
   * Строка отображаемая в случае отсутствия какого-либо значения
   * (Text displayed when there is no value)
   */
  placeholder?: string
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
}

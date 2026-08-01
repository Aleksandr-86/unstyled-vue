export interface LocalizedString {
  /** Описание на английском языке */
  en: string
  /** Описание на русском языке */
  ru: string
}

export interface PropItem {
  /** Описание свойства */
  description: LocalizedString
  /** Свойство не является обязательным */
  isOptional: boolean
  /** Имя свойства */
  name: string
  /** Тип (объединение типов) свойства */
  type: string

  /** Значение по умолчанию */
  base?: string
}

export interface ComposableParameter {
  /** Описание параметра */
  description: LocalizedString
  /** Имя параметра */
  name: string
  /** Тип параметра */
  type: string
}

export interface ComposableReturnValue {
  description: LocalizedString
  name: string
  parameters: ComposableParameter[]
  returnValue: string
  type: 'function' | 'computed'
}

export interface ComposableData {
  /** Описание составной функции */
  description: LocalizedString
  /** Имя составной функции */
  name: string
  /** Параметры составной функции */
  parameters: ComposableParameter[]
  returns: ComposableReturnValue[]
}

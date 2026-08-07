export interface LocalizedString {
  /** Описание на английском языке */
  en: string
  /** Описание на русском языке */
  ru: string
}

export interface PropertyData {
  /** Описание свойства */
  description: LocalizedString
  /** Свойство не является обязательным */
  isOptional: boolean
  /** Имя свойства */
  name: string
  /** Тип (объединение типов) свойства */
  type: string
}

export interface PropItem extends PropertyData {
  /** Значение по умолчанию */
  base?: string
}

export interface ComposableParameter {
  /** Описание параметра */
  description: string
  /** Имя параметра */
  name: string
  /** Тип параметра */
  type: string
}

export interface ComposableData {
  /** Параметры составной функции */
  parameters: ComposableParameter[]
}

export interface InterfaceItem {
  interfaceName: string
  properties: PropertyData[]
}

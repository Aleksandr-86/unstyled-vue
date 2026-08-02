import fg from 'fast-glob'
import path from 'path'
import type { JSDoc } from 'ts-morph'
import { MethodSignature, Node, Project, PropertySignature, TypeAliasDeclaration } from 'ts-morph'
import { fileURLToPath } from 'url'

import type { LocalizedString } from './types'
import type { InterfaceItem, PropertyData } from './types'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SOURCE_DIRS = ['../src/types/**/*.ts', '../src/composables/**/*.ts']
const TS_CONFIG_PATH = './tsconfig.app.json'

const data: Record<string, InterfaceItem> = {}

/** Разбор текста JSDoc узла */
function parseJsDocComment(jsDoc: JSDoc | undefined): LocalizedString {
  if (!jsDoc) return { ru: '', en: '' }

  const comment = jsDoc.getComment()
  let raw = ''

  if (typeof comment === 'string') {
    raw = comment
  } else if (Array.isArray(comment)) {
    raw = comment.map((c) => (c !== undefined ? c.getText() : '')).join('\n')
  }

  if (!raw) {
    raw = jsDoc.getDescription()
  }

  const lines = raw
    .split('\n')
    .map((line) => line.replace(/^\s*\*\s?/, '').trim())
    .filter((line) => line.length > 0)

  const hasCyrillic = (s: string) => /[а-яёА-ЯЁ]/.test(s)
  const ruLines: string[] = []
  const enLines: string[] = []

  for (const line of lines) {
    if (hasCyrillic(line)) {
      ruLines.push(line)
    } else {
      enLines.push(line)
    }
  }

  return {
    ru: ruLines.join(' '),
    en: enLines.join(' '),
  }
}

/** Извлечение данных из PropertySignature (для свойств интерфейсов/объектов) */
function extractPropertyData(propertySignature: PropertySignature): PropertyData {
  const jsDoc = propertySignature.getJsDocs()[0]
  const typeNodeText = propertySignature.getTypeNode()?.getText()
  const type = typeNodeText?.startsWith('{') ? typeNodeText : typeNodeText || propertySignature.getType().getText()

  return {
    description: parseJsDocComment(jsDoc),
    name: propertySignature.getName(),
    isOptional: propertySignature.hasQuestionToken(),
    type,
  }
}

/** Извлечение JSDoc из TypeAliasDeclaration */
function extractTypeAliasAsProperty(typeAlias: TypeAliasDeclaration): PropertyData {
  const jsDoc = typeAlias.getJsDocs()[0]
  const typeNodeText = typeAlias.getTypeNode()?.getText()
  const type = typeNodeText || typeAlias.getType().getText()

  return {
    description: parseJsDocComment(jsDoc),
    name: typeAlias.getName(),
    isOptional: false,
    type,
  }
}

/** Извлечение данных из MethodSignature (для методов интерфейсов) */
function extractMethodData(methodSignature: MethodSignature): PropertyData {
  const jsDoc = methodSignature.getJsDocs()[0]
  const typeText = methodSignature.getText()

  return {
    description: parseJsDocComment(jsDoc),
    name: methodSignature.getName(),
    isOptional: false,
    type: typeText,
  }
}

/** Загрузка данных через ts-morph */
function loadData(): Record<string, InterfaceItem> {
  const project = new Project({
    tsConfigFilePath: TS_CONFIG_PATH,
    skipAddingFilesFromTsConfig: false,
  })

  for (const sourceDir of SOURCE_DIRS) {
    const typesGlob = path.resolve(__dirname, sourceDir).replace(/\\/g, '/')
    const tsFiles = fg.globSync(typesGlob)
    project.addSourceFilesAtPaths(tsFiles)
  }

  project.resolveSourceFileDependencies()

  const sourceFiles = project.getSourceFiles()

  for (const sourceFile of sourceFiles) {
    // Обработка интерфейсов
    for (const iface of sourceFile.getInterfaces()) {
      const interfaceName = iface.getName()
      const propertyData = [
        ...iface.getProperties().map(extractPropertyData),
        ...iface.getMethods().map(extractMethodData),
      ]

      data[interfaceName] = { interfaceName, properties: propertyData }
    }

    // Обработка псевдонимов типов
    const typeAliases = sourceFile.getTypeAliases()

    for (const typeAlias of typeAliases) {
      const typeName = typeAlias.getName()
      const typeNode = typeAlias.getTypeNode()
      const propertyData: PropertyData[] = []

      // Объект-литерал type T = { prop: string }
      if (typeNode && Node.isTypeLiteral(typeNode)) {
        for (const member of typeNode.getMembers()) {
          if (Node.isPropertySignature(member)) {
            propertyData.push(extractPropertyData(member))
          }
        }
      }
      // Тип-функция, примитив или утилитарный тип
      else {
        propertyData.push(extractTypeAliasAsProperty(typeAlias))
      }

      data[typeName] = {
        interfaceName: typeName,
        properties: propertyData,
      }
    }
  }

  return data
}

loadData()

export { data }

export default {
  load: loadData,
}

import { parse } from '@vue/compiler-sfc'
import fg from 'fast-glob'
import fs from 'fs'
import path from 'path'
import { type InterfaceDeclaration, JSDoc, Project, PropertySignature, SyntaxKind } from 'ts-morph'
import { fileURLToPath } from 'url'

import type { PropItem } from './types'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

declare const data: Record<string, PropItem[]>
export { data }

/** Извлекает значения по умолчанию свойств компонента из АСД блока script однофайловых Vue-компонентов */
function getDefaultValues(content: string, project: Project): Record<string, string> {
  const defaults: Record<string, string> = {}
  const tempFile = project.createSourceFile('scratch_defaults.ts', content, { overwrite: true })
  const propsVarNames = new Set<string>()
  const varDeclarations = tempFile.getDescendantsOfKind(SyntaxKind.VariableDeclaration)

  for (const varDecl of varDeclarations) {
    const initializer = varDecl.getInitializer()
    if (initializer && initializer.getKind() === SyntaxKind.CallExpression) {
      const callExpr = initializer.asKindOrThrow(SyntaxKind.CallExpression)
      if (callExpr.getExpression().getText() === 'defineProps') {
        const nameNode = varDecl.getNameNode()
        if (nameNode.getKind() === SyntaxKind.Identifier) {
          propsVarNames.add(nameNode.getText())
        }
      }
    }
  }

  for (const varDecl of varDeclarations) {
    const nameNode = varDecl.getNameNode()
    const initializer = varDecl.getInitializer()
    if (nameNode.getKind() !== SyntaxKind.ObjectBindingPattern || !initializer) {
      continue
    }

    let isDefinePropsDestructure = false
    if (initializer.getKind() === SyntaxKind.CallExpression) {
      const callExpr = initializer.asKindOrThrow(SyntaxKind.CallExpression)
      if (callExpr.getExpression().getText() === 'defineProps') {
        isDefinePropsDestructure = true
      }
    } else if (initializer.getKind() === SyntaxKind.Identifier) {
      if (propsVarNames.has(initializer.getText())) {
        isDefinePropsDestructure = true
      }
    }

    if (isDefinePropsDestructure) {
      const bindingPattern = nameNode.asKindOrThrow(SyntaxKind.ObjectBindingPattern)
      for (const element of bindingPattern.getElements()) {
        const propName = element.getName()
        const elementInitializer = element.getInitializer()
        if (elementInitializer) {
          defaults[propName] = elementInitializer.getText()
        }
      }
    }
  }

  project.removeSourceFile(tempFile)
  return defaults
}

/** Извлекает русское и английское описание из JSDoc. */
function extractDescription(jsDoc: JSDoc | undefined): { ru: string; en: string } {
  if (!jsDoc) return { ru: '', en: '' }

  // Обратная совместимость: старые теги @ru / @en
  const ruTag = jsDoc.getTags().find((t) => t.getTagName() === 'ru')
  const enTag = jsDoc.getTags().find((t) => t.getTagName() === 'en')

  if (ruTag || enTag) {
    return {
      ru: ruTag?.getCommentText() || '',
      en: enTag?.getCommentText() || '',
    }
  }

  const comment = jsDoc.getComment()
  let raw = ''

  if (typeof comment === 'string') {
    raw = comment
  } else if (Array.isArray(comment)) {
    raw = comment
      .map((c) => {
        if (c !== undefined) {
          return c.getText()
        }

        return ''
      })
      .join('\n')
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
    if (hasCyrillic(line)) ruLines.push(line)
    else enLines.push(line)
  }

  return {
    ru: ruLines.join(' '),
    en: enLines.join(' '),
  }
}

/**
 * Функция добавляет свойства общего из интерфейса, общего для нескольких компонентов
 * !!! Переделать для работы в автоматическом режиме на основе поиска расширений интерфейсов
 */
function mixProperties(
  interfaceName: string,
  globalInterfaces: Record<string, InterfaceDeclaration>,
  allInterfaceProperties: PropertySignature[],
) {
  const SHARED: Record<string, string> = {
    baseinputprops: 'BaseFieldProps',
    basetextareaprops: 'BaseFieldProps',
  }

  const propKey = SHARED[interfaceName.toLocaleLowerCase()]

  if (propKey !== undefined && globalInterfaces[propKey]) {
    const baseFieldProps = globalInterfaces['BaseFieldProps'].getProperties()
    // Дедуплирование через множество
    const targetPropNames = new Set(allInterfaceProperties.map((p) => p.getName()))
    for (const fieldProp of baseFieldProps) {
      if (!targetPropNames.has(fieldProp.getName())) {
        allInterfaceProperties.push(fieldProp)
      }
    }
  }
}

export default {
  load() {
    const project = new Project()
    const allProps: Record<string, PropItem[]> = {}

    // критически важно для windows: замена обратных черт на прямые для fast-glob
    const vueGlob = path.resolve(__dirname, '../src/components/**/*.vue').replace(/\\/g, '/')
    const typesGlob = path.resolve(__dirname, '../src/types/**/*.ts').replace(/\\/g, '/')
    const componentsTsGlob = path.resolve(__dirname, '../src/components/**/*.ts').replace(/\\/g, '/')

    const vueFiles = fg.globSync(vueGlob)
    const tsFiles = fg.globSync([typesGlob, componentsTsGlob])

    if (tsFiles.length > 0) {
      project.addSourceFilesAtPaths(tsFiles)
    }

    // Обработка однофайловых Vue-компонентов
    for (const vueFilePath of vueFiles) {
      const fileContent = fs.readFileSync(vueFilePath, 'utf-8')
      const { descriptor } = parse(fileContent)
      const scriptBlock = descriptor.scriptSetup || descriptor.script
      if (scriptBlock && (scriptBlock.lang === 'ts' || !scriptBlock.lang)) {
        const virtualPath = vueFilePath + '.ts'
        project.createSourceFile(virtualPath, scriptBlock.content, { overwrite: true })
      }
    }

    // Сбор всех интерфейсов проекта, заканчивающиеся на "Props", в словарь.
    const globalInterfaces: Record<string, InterfaceDeclaration> = {}
    const sourceFiles = project.getSourceFiles()
    for (const file of sourceFiles) {
      for (const inter of file.getInterfaces()) {
        const interfaceName = inter.getName()
        if (interfaceName.endsWith('Props')) {
          globalInterfaces[interfaceName] = inter
        }
      }
    }

    // Сопоставление каждого Vue-компонента с его интерфейсом
    for (const vueFilePath of vueFiles) {
      const componentName = path.basename(vueFilePath, '.vue') // например, "BaseInput"
      const interfaceName = `${componentName}Props` // например, "BaseInputProps"
      const targetInterface = globalInterfaces[interfaceName]
      if (!targetInterface) continue

      // Создаёт массив из свойств текущего интерфейса (например, BaseInputProps)
      const allInterfaceProperties = [...targetInterface.getProperties()]

      // Если обрабатывается BaseInputProps, безопасно подмешиваются свойства из BaseFieldProps
      mixProperties(interfaceName, globalInterfaces, allInterfaceProperties)

      allInterfaceProperties.sort((a, b) => {
        const aOptional = a.hasQuestionToken()
        const bOptional = b.hasQuestionToken()
        // Если один обязательный, а второй нет — обязательный двигаем вверх
        if (aOptional !== bOptional) {
          return aOptional ? 1 : -1 // false (обязательный) пойдет раньше, чем true (необязательный)
        }
        // Если у них одинаковый статус обязательности, сортируем по алфавиту от A до Z
        return a.getName().localeCompare(b.getName())
      })

      const fileContent = fs.readFileSync(vueFilePath, 'utf-8')
      const { descriptor } = parse(fileContent)
      const scriptBlock = descriptor.scriptSetup || descriptor.script
      if (!scriptBlock) continue

      const fileDefaults = getDefaultValues(scriptBlock.content, project)

      // Использование массива одномерных свойств напрямую (без .getProperties())
      allProps[interfaceName] = allInterfaceProperties.map((prop) => {
        const propName = prop.getName()
        const jsDocs = prop.getJsDocs()
        const jsDoc = jsDocs[0]

        const { en: enText, ru: ruText } = extractDescription(jsDoc)

        const resolvedDefault = propName === 'classes' ? fileDefaults['ui'] : fileDefaults[propName]
        const typeNodeText = prop.getTypeNode()?.getText()
        const type = typeNodeText?.startsWith('{') ? typeNodeText : typeNodeText || prop.getType().getText()

        return {
          description: {
            en: String(enText).trim(),
            ru: String(ruText).trim(),
          },
          isOptional: prop.hasQuestionToken(),
          name: propName,
          type,
          base: resolvedDefault,
        }
      })
    }

    // Удаление виртуальных файлов
    for (const vueFilePath of vueFiles) {
      const virtualFile = project.getSourceFile(vueFilePath + '.ts')
      if (virtualFile) {
        project.removeSourceFile(virtualFile)
      }
    }

    // Контроль удаления виртуальных файлов
    const virtualFilesAfter = project.getSourceFiles().filter((file) => file.getFilePath().endsWith('.vue.ts')).length
    if (virtualFilesAfter > 0) {
      console.error(
        '\x1b[31m%s\x1b[0m',
        `[ERROR] Обнаружена утечка памяти! ${virtualFilesAfter} виртуальных файлов не было удалено.`,
      )
      process.exit(1)
    }

    return allProps
  },
}

import { JSDoc } from 'ts-morph'

import { LocalizedString } from './types'

/** Извлекает русское и английское описание из JSDoc. */
export function extractDescription(jsDoc: JSDoc | undefined): LocalizedString {
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

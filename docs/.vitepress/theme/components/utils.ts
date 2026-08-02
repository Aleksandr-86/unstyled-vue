export function codeString(str: string) {
  const inner = str
    .replace(/^\s*\{\s*/, '')
    .replace(/\s*\}\s*$/, '')
    .trim()

  if (!inner) return '{}'

  const tokens = inner.split(/\s+/).filter(Boolean)
  const lines: string[] = []

  for (let i = 0; i < tokens.length; i += 2) {
    const name = tokens[i]
    const type = tokens[i + 1]
    if (name && type) {
      lines.push(`  ${name} ${type}`)
    }
  }

  return '{\n' + lines.join('\n') + '\n}'
}

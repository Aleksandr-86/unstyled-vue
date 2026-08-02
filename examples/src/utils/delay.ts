/**
 * Возвращает обещание через указанное количество миллисекунд
 * @param ms количество миллисекунд
 * @returns Promise
 */
export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

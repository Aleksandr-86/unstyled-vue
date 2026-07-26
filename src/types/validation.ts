export type Rule<T = unknown> = (value: T, signal?: AbortSignal) => string | boolean | Promise<string | boolean | void>

export const createRule = <T = unknown>(fn: Rule<T>): Rule<T> => fn

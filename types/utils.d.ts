export type Nullish<T> = T | null | undefined

export type Callback<T> = () => T

export function isNotNull<T>(arg: T): arg is NonNullable<T> {
  return arg !== null
}

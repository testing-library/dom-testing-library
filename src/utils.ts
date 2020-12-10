export function isNotNull<T>(arg: T): arg is NonNullable<T> {
  return arg !== null
}

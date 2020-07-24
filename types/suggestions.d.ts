export interface Suggestion {
  queryName: string
  toString(): string
}
export declare function getSuggestedQuery(
  element: HTMLElement,
  variant?: string,
): Suggestion | undefined

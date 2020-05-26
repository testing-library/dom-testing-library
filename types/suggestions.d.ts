export interface Suggestion {
  queryName: string
  toString(): string
}

export function getSuggestedQuery(element: HTMLElement): Suggestion | undefined

export interface Suggestion {
  queryName: string
  toString(): string
}

export type Variant =
  | 'get'
  | 'getAll'
  | 'query'
  | 'queryAll'
  | 'find'
  | 'findAll'

export type Method =
  | 'Role'
  | 'LabelText'
  | 'PlaceholderText'
  | 'Text'
  | 'DisplayValue'
  | 'AltText'
  | 'Title'
  | 'TestId'

export function getSuggestedQuery(
  element: HTMLElement,
  variant: Variant,
  method?: Method,
): Suggestion | undefined

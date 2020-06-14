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
  | 'role'
  | 'LabelText'
  | 'labeltext'
  | 'PlaceholderText'
  | 'placeholdertext'
  | 'Text'
  | 'text'
  | 'DisplayValue'
  | 'displayvalue'
  | 'AltText'
  | 'alttext'
  | 'Title'
  | 'title'
  | 'TestId'
  | 'testid'

export function getSuggestedQuery(
  element: HTMLElement,
  variant?: Variant,
  method?: Method,
): Suggestion | undefined

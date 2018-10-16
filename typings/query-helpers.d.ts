import {Matcher, MatcherOptions} from './matches'

export interface SelectorMatcherOptions extends MatcherOptions {
  selector?: string
}

export type QueryByAttribute = (
  attribute: string,
  container: HTMLElement,
  id: Matcher,
  options?: MatcherOptions,
) => HTMLElement | null

export type AllByAttribute = (
  attribute: string,
  container: HTMLElement,
  id: Matcher,
  options?: MatcherOptions,
) => HTMLElement[]

export const queryByAttribute: QueryByAttribute
export const queryAllByAttribute: AllByAttribute
export const firstResultOrNull: (
  fn: AllByAttribute,
  container?: HTMLElement,
  id?: Matcher,
  options?: MatcherOptions,
) => HTMLElement | null
export const debugDOM: (htmlElement: HTMLElement) => string
export const getElementError: (message: string, container: HTMLElement) => Error

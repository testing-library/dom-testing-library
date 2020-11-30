import {Matcher, MatcherOptions} from './matches'
import {waitForOptions} from './wait-for'

export interface SelectorMatcherOptions extends MatcherOptions {
  selector?: string
}

export type QueryByAttribute = (
  attribute: string,
  container: Element,
  id: Matcher,
  options?: MatcherOptions,
) => Element | null

export type AllByAttribute = (
  attribute: string,
  container: Element,
  id: Matcher,
  options?: MatcherOptions,
) => Element[]

export const queryByAttribute: QueryByAttribute
export const queryAllByAttribute: AllByAttribute
export function getElementError(message: string, container: Element): Error

/**
 * query methods have a common call signature. Only the return type differs.
 */
export type QueryMethod<Arguments extends any[], Return> = (
  container: Element,
  ...args: Arguments
) => Return
export type QueryBy<Arguments extends any[]> = QueryMethod<
  Arguments,
  Element | null
>
export type GetAllBy<Arguments extends any[]> = QueryMethod<
  Arguments,
  Element[]
>
export type FindAllBy<Arguments extends any[]> = QueryMethod<
  [Arguments[0], Arguments[1]?, waitForOptions?],
  Promise<Element[]>
>
export type GetBy<Arguments extends any[]> = QueryMethod<Arguments, Element>
export type FindBy<Arguments extends any[]> = QueryMethod<
  [Arguments[0], Arguments[1]?, waitForOptions?],
  Promise<Element>
>

export type BuiltQueryMethods<Arguments extends any[]> = [
  QueryBy<Arguments>,
  GetAllBy<Arguments>,
  GetBy<Arguments>,
  FindAllBy<Arguments>,
  FindBy<Arguments>,
]
export function buildQueries<Arguments extends any[]>(
  queryByAll: GetAllBy<Arguments>,
  getMultipleError: (container: Element, ...args: Arguments) => string,
  getMissingError: (container: Element, ...args: Arguments) => string,
): BuiltQueryMethods<Arguments>

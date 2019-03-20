import {Matcher} from './matches'
import * as queries from './queries'

export type BoundFunction<T> = T extends (
  attribute: string,
  element: HTMLElement,
  text: infer P,
  options: infer Q,
) => infer R
  ? (text: P, options?: Q) => R
  : T extends (a1: any, text: infer P, options: infer Q) => infer R
    ? (text: P, options?: Q) => R
    : never
export type BoundFunctions<T> = {[P in keyof T]: BoundFunction<T[P]>}

export function getQueriesForElement(
  element: HTMLElement,
  queriesToBind?:
    | BoundFunctions<typeof queries>
    | BoundFunctions<typeof queries>[],
): BoundFunctions<typeof queries>

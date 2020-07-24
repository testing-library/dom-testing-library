import * as defaultQueries from './queries'

export type BoundFunction<T> = T extends (
  attribute: string,
  element: HTMLElement,
  text: infer P,
  options: infer Q,
) => infer R
  ? (text: P, options?: Q) => R
  : T extends (
      a1: any,
      text: infer P,
      options: infer Q,
      waitForElementOptions: infer W,
    ) => infer R
  ? (text: P, options?: Q, waitForElementOptions?: W) => R
  : T extends (a1: any, text: infer P, options: infer Q) => infer R
  ? (text: P, options?: Q) => R
  : never
export type BoundFunctions<T> = {[P in keyof T]: BoundFunction<T[P]>}

export type Query = (
  container: HTMLElement,
  ...args: any[]
) =>
  | Error
  | Promise<HTMLElement[]>
  | Promise<HTMLElement>
  | HTMLElement[]
  | HTMLElement
  | null

export interface Queries {
  [T: string]: Query
}

/**
 * @param {HTMLElement} element container
 * @param {FuncMap} queries object of functions
 * @param {Object} initialValue for reducer
 * @returns {FuncMap} returns object of functions bound to container
 */
function getQueriesForElement<T extends Queries>(
  element: HTMLElement,
  queries: Queries = defaultQueries,
  initialValue = {},
): BoundFunctions<T> {
  return Object.keys(queries).reduce((helpers, key) => {
    const fn: Query = queries[key]
    helpers[key] = fn.bind(null, element)
    return helpers
  }, initialValue) as BoundFunctions<T>
}

export {getQueriesForElement}

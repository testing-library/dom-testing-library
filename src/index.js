import {getQueriesForElement} from './get-queries-for-element'
import * as queries from './queries'
import * as queryHelpers from './query-helpers'

export * from './queries'
export * from './wait'
export * from './wait-for-element'
export * from './wait-for-dom-change'
export {getDefaultNormalizer} from './matches'
export * from './get-node-text'
export * from './events'
export * from './get-queries-for-element'
export * from './query-helpers'
export * from './pretty-dom'
export {configure} from './config'

export {
  // The original name of bindElementToQueries was weird
  // The new name is better. Remove this in the next major version bump.
  getQueriesForElement as bindElementToQueries,
  getQueriesForElement as within,
  // export query utils under a namespace for convenience:
  queries,
  queryHelpers,
}

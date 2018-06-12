import {getQueriesForElement} from './get-queries-for-element'
import * as queries from './queries'

// exporting on the queries namespace as a convenience
// in addition to exporting the queries themselves
export {queries}

export * from './queries'
export * from './wait'
export * from './wait-for-element'
export * from './matches'
export * from './get-node-text'
export * from './events'
export * from './get-queries-for-element'
export * from './pretty-dom'

export {
  // The original name of bindElementToQueries was weird
  // The new name is better. Remove this in the next major version bump.
  getQueriesForElement as bindElementToQueries,
  getQueriesForElement as within,
}

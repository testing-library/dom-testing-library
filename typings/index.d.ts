// TypeScript Version: 2.8
import {getQueriesForElement} from './get-queries-for-element'
import * as queries from './queries'
import * as queryHelpers from './query-helpers'

declare const within: typeof getQueriesForElement
export {queries, queryHelpers, within}

export * from './queries'
export * from './query-helpers'
export * from './wait'
export * from './wait-for-dom-change'
export * from './wait-for-element'
export * from './matches'
export * from './get-node-text'
export * from './events'
export * from './get-queries-for-element'
export * from './pretty-dom'
export * from './config'

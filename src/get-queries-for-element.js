import * as defaultQueries from './queries'
import {prettyDOM} from './pretty-dom'

function debug(...args) {
  // eslint-disable-next-line no-console
  console.log(prettyDOM(...args))
}

/**
 * @typedef {{[key: string]: Function}} FuncMap
 */

/**
 * @param {HTMLElement} element container
 * @param {FuncMap} queries object of functions
 * @returns {FuncMap} returns object of functions bound to container
 */
function getQueriesForElement(element, queries = {debug, ...defaultQueries}) {
  return Object.keys(queries).reduce((helpers, key) => {
    const fn = queries[key]
    helpers[key] = fn.bind(null, element)
    return helpers
  }, {})
}

export {getQueriesForElement}

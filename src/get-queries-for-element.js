import * as defaultQueries from './queries'

/**
 * @typedef {{[key: string]: Function}} FuncMap
 */

/**
 * @param {HTMLElement} element container
 * @param {FuncMap} queries object of functions
 * @param {Object} initialValue for reducer
 * @returns {FuncMap} returns object of functions bound to container
 */
function getQueriesForElement(
  element,
  queries = defaultQueries,
  initialValue = {},
) {
  return Object.keys(queries).reduce((helpers, key) => {
    const fn = queries[key]
    helpers[key] = fn.bind(null, element)
    return helpers
  }, initialValue)
}

export {getQueriesForElement}

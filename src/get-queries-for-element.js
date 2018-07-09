import * as defaultQueries from './queries'

/**
 * @typedef {{[key: string]: Function}} FuncMap
 */

/**
 * @param {HTMLElement} element container
 * @param {FuncMap|FuncMap[]} queries object of functions, or array of objects
 * @returns {FuncMap} returns object of functions bound to container
 */
function getQueriesForElement(element, queries = defaultQueries) {
  let flattenedQueries
  if (Array.isArray(queries)) {
    flattenedQueries = Object.assign({}, ...queries)
  } else {
    flattenedQueries = queries
  }
  return Object.entries(flattenedQueries).reduce((helpers, [key, fn]) => {
    helpers[key] = fn.bind(null, element)
    return helpers
  }, {})
}

export {getQueriesForElement}

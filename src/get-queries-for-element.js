import * as queries from './queries'

function getQueriesForElement(element) {
  return Object.entries(queries).reduce((helpers, [key, fn]) => {
    helpers[key] = fn.bind(null, element)
    return helpers
  }, {})
}

export {getQueriesForElement}

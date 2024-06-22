import * as defaultQueries from './queries'

function getQueriesForElement(
  element: HTMLElement,
  queries: FuncMap = defaultQueries,
  initialValue: FuncMap = {},
) {
  return Object.keys(queries).reduce((helpers, key) => {
    const fn = queries[key]
    helpers[key] = fn.bind(null, element)
    return helpers
  }, initialValue)
}

type FuncMap = {[key: string]: Function}

export {getQueriesForElement}

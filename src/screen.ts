import * as queries from './queries'
import {getQueriesForElement} from './get-queries-for-element'
import {logDOM} from './pretty-dom'

const debug = (element, maxLength, options) =>
  Array.isArray(element)
    ? element.forEach(el => logDOM(el, maxLength, options))
    : logDOM(element, maxLength, options)

export const screen =
  typeof document !== 'undefined' && document.body
    ? getQueriesForElement(document.body, queries, {debug})
    : Object.keys(queries).reduce(
        (helpers, key) => {
          helpers[key] = () => {
            throw new TypeError(
              'For queries bound to document.body a global document has to be available... Learn more: https://testing-library.com/s/screen-global-error',
            )
          }
          return helpers
        },
        {debug},
      )

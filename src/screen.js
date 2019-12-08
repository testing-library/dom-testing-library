import * as queries from './queries'
import {getQueriesForElement} from './get-queries-for-element'

export const screen =
  typeof document !== 'undefined' && document.body
    ? getQueriesForElement(document.body)
    : Object.keys(queries).reduce((helpers, key) => {
        helpers[key] = () => {
          throw new TypeError(
            'For queries bound to document.body a global document has to be available... Learn more: https://testing-library.com/s/screen-global-error',
          )
        }
        return helpers
      }, {})

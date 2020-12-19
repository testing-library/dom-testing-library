import {getPlaygroundUrl} from './playground-helper'
import * as queries from './queries'
import {getQueriesForElement} from './get-queries-for-element'
import {logDOM} from './pretty-dom'
import {getDocument} from './helpers'

const debug = (element, maxLength, options) =>
  Array.isArray(element)
    ? element.forEach(el => logDOM(el, maxLength, options))
    : logDOM(element, maxLength, options)

const logTestingPlaygroundURL = (element = getDocument().body) => {
  const url = getPlaygroundUrl(element)
  if (url) {
    console.log(`Open this URL in your browser\n\n${url}`)
  }
}

const initialValue = {debug, logTestingPlaygroundURL}
export const screen =
  typeof document !== 'undefined' && document.body
    ? getQueriesForElement(document.body, queries, initialValue)
    : Object.keys(queries).reduce((helpers, key) => {
        helpers[key] = () => {
          throw new TypeError(
            'For queries bound to document.body a global document has to be available... Learn more: https://testing-library.com/s/screen-global-error',
          )
        }
        return helpers
      }, initialValue)

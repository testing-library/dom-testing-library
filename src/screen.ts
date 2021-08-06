import {compressToEncodedURIComponent} from 'lz-string'
import type {OptionsReceived} from 'pretty-format'
import {getQueriesForElement} from './get-queries-for-element'
import {getDocument} from './helpers'
import {logDOM} from './pretty-dom'
import * as queries from './queries'

function unindent(string: string) {
  // remove white spaces first, to save a few bytes.
  // testing-playground will reformat on load any ways.
  return string.replace(/[ \t]*[\n][ \t]*/g, '\n')
}

function encode(value: string) {
  return compressToEncodedURIComponent(unindent(value))
}

function getPlaygroundUrl(markup: string) {
  return `https://testing-playground.com/#markup=${encode(markup)}`
}

const debug = (
  element: (Element | HTMLDocument)[],
  maxLength?: number,
  options?: OptionsReceived,
) =>
  Array.isArray(element)
    ? element.forEach(el => logDOM(el, maxLength, options))
    : logDOM(element, maxLength, options)

const logTestingPlaygroundURL = (element = getDocument().body) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!element || !('innerHTML' in element)) {
    console.log(`The element you're providing isn't a valid DOM element.`)
    return
  }
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!element.innerHTML) {
    console.log(`The provided element doesn't have any children.`)
    return
  }
  console.log(
    `Open this URL in your browser\n\n${getPlaygroundUrl(element.innerHTML)}`,
  )
}

const initialValue: {
  [key in keyof typeof queries | 'debug' | 'logTestingPlaygroundURL']?: Function
} = {debug, logTestingPlaygroundURL}

export const screen =
  typeof document !== 'undefined' && document.body // eslint-disable-line @typescript-eslint/no-unnecessary-condition
    ? getQueriesForElement(document.body, queries, initialValue)
    : typedKeysOf(queries).reduce<typeof initialValue>((helpers, key) => {
        helpers[key] = () => {
          throw new TypeError(
            'For queries bound to document.body a global document has to be available... Learn more: https://testing-library.com/s/screen-global-error',
          )
        }
        return helpers
      }, initialValue)

function typedKeysOf<O extends Object>(o: O) {
  return Object.keys(o) as Array<keyof O>
}

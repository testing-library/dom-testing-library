import prettyFormat from 'pretty-format'
import {getDocument} from './helpers'

function inCypress(dom) {
  const window =
    (dom.ownerDocument && dom.ownerDocument.defaultView) || undefined
  return (
    (typeof global !== 'undefined' && global.Cypress) ||
    (typeof window !== 'undefined' && window.Cypress)
  )
}

const inNode = () =>
  typeof process !== 'undefined' &&
  process.versions !== undefined &&
  process.versions.node !== undefined

const getMaxLength = dom =>
  inCypress(dom) ? 0 : process.env.DEBUG_PRINT_LIMIT || 7000

const {DOMElement, DOMCollection} = prettyFormat.plugins

function prettyDOM(
  dom = getDocument().body,
  maxLength = getMaxLength(dom),
  options,
) {
  if (maxLength === 0) {
    return ''
  }
  if (dom.documentElement) {
    dom = dom.documentElement
  }

  const debugContent = prettyFormat(dom, {
    plugins: [DOMElement, DOMCollection],
    printFunctionName: false,
    highlight: inNode(),
    ...options,
  })
  return maxLength !== undefined && dom.outerHTML.length > maxLength
    ? `${debugContent.slice(0, maxLength)}...`
    : debugContent
}

const logDOM = (...args) => console.log(prettyDOM(...args))

export {prettyDOM, logDOM}

/* eslint no-console:0 */

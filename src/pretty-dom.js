import prettyFormat from 'pretty-format'
import {getUserCodeFrame} from './get-user-code-frame'
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
  inCypress(dom)
    ? 0
    : (typeof process !== 'undefined' && process.env.DEBUG_PRINT_LIMIT) || 7000

const {DOMElement, DOMCollection} = prettyFormat.plugins

function prettyDOM(dom, maxLength, options) {
  if (!dom) {
    dom = getDocument().body
  }
  if (typeof maxLength !== 'number') {
    maxLength = getMaxLength(dom)
  }

  if (maxLength === 0) {
    return ''
  }
  if (dom.documentElement) {
    dom = dom.documentElement
  }

  let domTypeName = typeof dom
  if (domTypeName === 'object') {
    domTypeName = dom.constructor.name
  } else {
    // To don't fall with `in` operator
    dom = {}
  }
  if (!('outerHTML' in dom)) {
    throw new TypeError(
      `Expected an element or document but got ${domTypeName}`,
    )
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

const logDOM = (...args) => {
  const userCodeFrame = getUserCodeFrame()
  if (userCodeFrame) {
    console.log(`${prettyDOM(...args)}\n\n${userCodeFrame}`)
  } else {
    console.log(prettyDOM(...args))
  }
}

export {prettyDOM, logDOM}

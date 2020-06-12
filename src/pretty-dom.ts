import prettyFormat, {OptionsReceived} from 'pretty-format'
import {getDocument} from './helpers'

// Declare the potential Cypress variable
declare global {
  namespace NodeJS {
    interface Global {
      Cypress?: any
    }
  }
}

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

const getMaxLength = (dom): number =>
  inCypress(dom)
    ? 0
    : (typeof process !== 'undefined' &&
        parseInt(process.env.DEBUG_PRINT_LIMIT, 10)) ||
      7000

const {DOMElement, DOMCollection} = prettyFormat.plugins

function isDocument(dom?: Element | Document): dom is Document {
  return (dom as Document).documentElement !== undefined
}

function prettyDOM(
  dom?: Element | Document,
  maxLength?: number,
  options?: OptionsReceived,
) {
  if (!dom) {
    dom = getDocument().body
  }
  if (typeof maxLength !== 'number') {
    maxLength = getMaxLength(dom)
  }

  if (maxLength === 0) {
    return ''
  }
  if (isDocument(dom)) {
    dom = dom.documentElement
  }

  let domTypeName: string = typeof dom
  if (domTypeName === 'object') {
    domTypeName = dom.constructor.name
  } else {
    // To don't fall with `in` operator
    dom = {} as Element
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

const logDOM = (
  dom?: Element | HTMLDocument,
  maxLength?: number,
  options?: OptionsReceived,
) => console.log(prettyDOM(dom, maxLength, options))

export {prettyDOM, logDOM}

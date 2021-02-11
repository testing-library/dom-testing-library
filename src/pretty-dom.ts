import prettyFormat from 'pretty-format'
import {getUserCodeFrame} from './get-user-code-frame'
import {getDocument} from './helpers'

function inCypress(dom: Element | HTMLDocument) {
  const window = dom.ownerDocument?.defaultView ?? undefined
  return (
    (typeof global !== 'undefined' &&
      'Cypress' in global &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global as typeof global & {Cypress: any}).Cypress) ||
    (typeof window !== 'undefined' &&
      'Cypress' in window &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as typeof window & {Cypress: any}).Cypress)
  )
}

const inNode = () =>
  typeof process !== 'undefined' &&
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- for browser compatibility
  process.versions !== undefined &&
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- for browser compatibility
  process.versions.node !== undefined

const getMaxLength = (dom: Element | HTMLDocument): number =>
  inCypress(dom)
    ? 0
    : (typeof process !== 'undefined' &&
        process.env.DEBUG_PRINT_LIMIT &&
        parseInt(process.env.DEBUG_PRINT_LIMIT, 10)) ||
      7000

const {DOMElement, DOMCollection} = prettyFormat.plugins

function prettyDOM(
  dom?: Element | HTMLDocument,
  maxLength?: number,
  options?: prettyFormat.OptionsReceived,
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
  if (typeof dom === 'object' && 'documentElement' in dom) {
    dom = dom.documentElement
  }

  let domTypeName: string = typeof dom
  if (domTypeName === 'object') {
    domTypeName = dom.constructor.name
  } else {
    dom = undefined
  }

  if (!dom || !('outerHTML' in dom)) {
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
  return dom.outerHTML.length > maxLength
    ? `${debugContent.slice(0, maxLength)}...`
    : debugContent
}

const logDOM = (
  dom?: Element | HTMLDocument,
  maxLength?: number,
  options?: prettyFormat.OptionsReceived,
) => {
  const userCodeFrame = getUserCodeFrame()
  if (userCodeFrame) {
    console.log(`${prettyDOM(dom, maxLength, options)}\n\n${userCodeFrame}`)
  } else {
    console.log(prettyDOM(dom, maxLength, options))
  }
}

export {prettyDOM, logDOM, prettyFormat}

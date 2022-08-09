import * as prettyFormat from 'pretty-format'
import createDOMElementFilter from './DOMElementFilter'
import {getUserCodeFrame} from './get-user-code-frame'
import {getDocument} from './helpers'
import {getConfig} from './config'

const inNode = () =>
  typeof process !== 'undefined' &&
  process.versions !== undefined &&
  process.versions.node !== undefined

const {DOMCollection} = prettyFormat.plugins

// https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType#node_type_constants
const ELEMENT_NODE = 1
const COMMENT_NODE = 8

// https://github.com/facebook/jest/blob/615084195ae1ae61ddd56162c62bbdda17587569/packages/pretty-format/src/plugins/DOMElement.ts#L50
function filterCommentsAndDefaultIgnoreTagsTags(value) {
  return (
    value.nodeType !== COMMENT_NODE &&
    (value.nodeType !== ELEMENT_NODE ||
      !value.matches(getConfig().defaultIgnore))
  )
}

function prettyDOM(dom, maxLength, options = {}) {
  if (!dom) {
    dom = getDocument().body
  }
  if (typeof maxLength !== 'number') {
    maxLength =
      (typeof process !== 'undefined' && process.env.DEBUG_PRINT_LIMIT) || 7000
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

  const {
    filterNode = filterCommentsAndDefaultIgnoreTagsTags,
    ...prettyFormatOptions
  } = options

  const debugContent = prettyFormat.format(dom, {
    plugins: [createDOMElementFilter(filterNode), DOMCollection],
    printFunctionName: false,
    highlight: inNode(),
    ...prettyFormatOptions,
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

export {prettyDOM, logDOM, prettyFormat}

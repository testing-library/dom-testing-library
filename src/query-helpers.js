import {prettyDOM} from './pretty-dom'
import {fuzzyMatches, matches} from './matches'

/* eslint-disable complexity */
function debugDOM(htmlElement) {
  const limit = process.env.DEBUG_PRINT_LIMIT || 7000
  const inNode =
    typeof process !== 'undefined' &&
    process.versions !== undefined &&
    process.versions.node !== undefined
  const window =
    (htmlElement.ownerDocument && htmlElement.ownerDocument.defaultView) ||
    undefined
  const inCypress =
    (typeof global !== 'undefined' && global.Cypress) ||
    (typeof window !== 'undefined' && window.Cypress)
  /* istanbul ignore else */
  if (inCypress) {
    return ''
  } else if (inNode) {
    return prettyDOM(htmlElement, limit)
  } else {
    return prettyDOM(htmlElement, limit, {highlight: false})
  }
}
/* eslint-enable complexity */

function getElementError(message, container) {
  return new Error([message, debugDOM(container)].filter(Boolean).join('\n\n'))
}

function firstResultOrNull(queryFunction, ...args) {
  const result = queryFunction(...args)
  if (result.length === 0) return null
  return result[0]
}

function queryAllByAttribute(
  attribute,
  container,
  text,
  {exact = true, collapseWhitespace = true, trim = true} = {},
) {
  const matcher = exact ? matches : fuzzyMatches
  const matchOpts = {collapseWhitespace, trim}
  return Array.from(container.querySelectorAll(`[${attribute}]`)).filter(node =>
    matcher(node.getAttribute(attribute), node, text, matchOpts),
  )
}

function queryByAttribute(...args) {
  return firstResultOrNull(queryAllByAttribute, ...args)
}

export {
  debugDOM,
  getElementError,
  firstResultOrNull,
  queryAllByAttribute,
  queryByAttribute,
}

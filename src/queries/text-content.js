import {buildQueries, matches} from './all-utils'

function queryAllByTextContent(container, text, selector = '*') {
  return Array.from(container.querySelectorAll(selector)).filter(node =>
    matches(node.textContent, node, text, s => s),
  )
}

const getMultipleError = (c, text) =>
  `Found multiple elements with the text content: ${text}`
const getMissingError = (c, text) =>
  `Unable to find an element with the text content: ${text}. This could be because your text input didn't consider whitespace.`

const [
  queryByTextContent,
  getAllByTextContent,
  getByTextContent,
  findAllByTextContent,
  findByTextContent,
] = buildQueries(queryAllByTextContent, getMultipleError, getMissingError)

export {
  queryByTextContent,
  queryAllByTextContent,
  getByTextContent,
  getAllByTextContent,
  findAllByTextContent,
  findByTextContent,
}

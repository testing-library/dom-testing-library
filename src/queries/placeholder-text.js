import {queryAllByAttribute, buildQueries} from './all-utils'

function queryAllByPlaceholderText(...args) {
  return queryAllByAttribute('placeholder', ...args)
}
const getMultipleError = (c, text) =>
  `Found multiple elements with the placeholder text of: ${text}`
const getMissingError = (c, text) =>
  `Unable to find an element with the placeholder text of: ${text}`

const [
  queryByPlaceholderText,
  getAllByPlaceholderText,
  getByPlaceholderText,
  findAllByPlaceholderText,
  findByPlaceholderText,
] = buildQueries(queryAllByPlaceholderText, getMultipleError, getMissingError)

export {
  queryByPlaceholderText,
  queryAllByPlaceholderText,
  getByPlaceholderText,
  getAllByPlaceholderText,
  findAllByPlaceholderText,
  findByPlaceholderText,
}

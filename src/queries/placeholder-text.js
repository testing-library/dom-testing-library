import {wrapAllByQueryWithSuggestion} from '../query-helpers'
import {checkContainerType} from '../helpers'
import {queryAllByAttribute, buildQueries} from './all-utils'

function queryAllByPlaceholderText(...args) {
  checkContainerType(...args)
  return queryAllByAttribute('placeholder', ...args)
}
const getMultipleError = (c, text) =>
  `Found multiple elements with the placeholder text of: ${text}`
const getMissingError = (c, text) =>
  `Unable to find an element with the placeholder text of: ${text}`

const queryAllByPlaceholderTextWithSuggestions = wrapAllByQueryWithSuggestion(
  queryAllByPlaceholderText,
  queryAllByPlaceholderText.name,
  'queryAll',
)

const [
  queryByPlaceholderText,
  getAllByPlaceholderText,
  getByPlaceholderText,
  findAllByPlaceholderText,
  findByPlaceholderText,
] = buildQueries(queryAllByPlaceholderText, getMultipleError, getMissingError)

export {
  queryByPlaceholderText,
  queryAllByPlaceholderTextWithSuggestions as queryAllByPlaceholderText,
  getByPlaceholderText,
  getAllByPlaceholderText,
  findAllByPlaceholderText,
  findByPlaceholderText,
}

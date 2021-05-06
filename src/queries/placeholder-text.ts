import {wrapAllByQueryWithSuggestion} from '../query-helpers'
import {checkContainerType} from '../helpers'
import {AllByBoundAttribute, GetErrorFunction} from '../../types'
import {queryAllByAttribute, buildQueries} from './all-utils'

const queryAllByPlaceholderText: AllByBoundAttribute = (...args) => {
  checkContainerType(args[0])
  // TODO: Remove ignore after `queryAllByAttribute` will be moved to TS
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return queryAllByAttribute('placeholder', ...args)
}
const getMultipleError: GetErrorFunction = (c, text) =>
  `Found multiple elements with the placeholder text of: ${text}`
const getMissingError: GetErrorFunction = (c, text) =>
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

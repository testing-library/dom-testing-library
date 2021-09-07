import {wrapAllByQueryWithSuggestion} from '../query-helpers'
import {checkContainerType} from '../helpers'
import {AllByBoundAttribute, GetErrorFunction} from '../../types'
import {queryAllByAttribute, buildQueries} from './all-utils'

const queryAllByPlaceholderText: AllByBoundAttribute = (...args) => {
  checkContainerType(args[0])
  return queryAllByAttribute('placeholder', ...args)
}
const getMultipleError: GetErrorFunction<[unknown]> = (c, text) =>
  `Found multiple elements with the placeholder text of: ${text}`
const getMissingError: GetErrorFunction<[unknown]> = (c, text) =>
  `Unable to find an element with the placeholder text of: ${text}`

const queryAllByPlaceholderTextWithSuggestions = wrapAllByQueryWithSuggestion<
  // @ts-expect-error -- See `wrapAllByQueryWithSuggestion` Argument constraint comment
  [placeholderText: Matcher, options?: MatcherOptions]
>(queryAllByPlaceholderText, queryAllByPlaceholderText.name, 'queryAll')

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

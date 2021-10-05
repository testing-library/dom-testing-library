import {
  queryAllByAttribute,
  wrapAllByQueryWithSuggestion,
} from '../query-helpers'
import {checkContainerType} from '../helpers'
import {
  AllByBoundAttribute,
  GetErrorFunction,
  MatcherOptions,
} from '../../types'
import {buildQueries} from './all-utils'

const queryAllByAltText: AllByBoundAttribute = (
  container,
  alt,
  options: MatcherOptions = {},
) => {
  checkContainerType(container)
  return queryAllByAttribute('alt', container, alt, options)
}

const getMultipleError: GetErrorFunction<[unknown]> = (c, alt) =>
  `Found multiple elements with the alt text: ${alt}`
const getMissingError: GetErrorFunction<[unknown]> = (c, alt) =>
  `Unable to find an element with the alt text: ${alt}`

const queryAllByAltTextWithSuggestions = wrapAllByQueryWithSuggestion<
  // @ts-expect-error -- See `wrapAllByQueryWithSuggestion` Argument constraint comment
  [altText: Matcher, options?: SelectorMatcherOptions]
>(queryAllByAltText, queryAllByAltText.name, 'queryAll')
const [
  queryByAltText,
  getAllByAltText,
  getByAltText,
  findAllByAltText,
  findByAltText,
] = buildQueries(queryAllByAltText, getMultipleError, getMissingError)

export {
  queryByAltText,
  queryAllByAltTextWithSuggestions as queryAllByAltText,
  getByAltText,
  getAllByAltText,
  findAllByAltText,
  findByAltText,
}

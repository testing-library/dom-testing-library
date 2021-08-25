import {checkContainerType} from '../helpers'
import {wrapAllByQueryWithSuggestion} from '../query-helpers'
import {AllByBoundAttribute, GetErrorFunction} from '../../types'
import {queryAllByAttribute, getConfig, buildQueries} from './all-utils'

const getTestIdAttribute = () => getConfig().testIdAttribute

const queryAllByTestId: AllByBoundAttribute = (...args) => {
  checkContainerType(args[0])
  return queryAllByAttribute(getTestIdAttribute(), ...args)
}

const getMultipleError: GetErrorFunction<[unknown]> = (c, id) =>
  `Found multiple elements by: [${getTestIdAttribute()}="${id}"]`
const getMissingError: GetErrorFunction<[unknown]> = (c, id) =>
  `Unable to find an element by: [${getTestIdAttribute()}="${id}"]`

const queryAllByTestIdWithSuggestions = wrapAllByQueryWithSuggestion<
  // @ts-expect-error -- See `wrapAllByQueryWithSuggestion` Argument constraint comment
  [testId: Matcher, options?: MatcherOptions]
>(queryAllByTestId, queryAllByTestId.name, 'queryAll')

const [
  queryByTestId,
  getAllByTestId,
  getByTestId,
  findAllByTestId,
  findByTestId,
] = buildQueries(queryAllByTestId, getMultipleError, getMissingError)

export {
  queryByTestId,
  queryAllByTestIdWithSuggestions as queryAllByTestId,
  getByTestId,
  getAllByTestId,
  findAllByTestId,
  findByTestId,
}

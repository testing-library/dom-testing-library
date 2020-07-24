import {checkContainerType} from '../helpers'
import {wrapAllByQueryWithSuggestion} from '../query-helpers'
import {
  queryAllByAttribute,
  getConfig,
  buildQueries,
  Matcher,
  MatcherOptions,
} from './all-utils'

const getTestIdAttribute = () => getConfig().testIdAttribute

function queryAllByTestId(
  container: HTMLElement,
  testId: Matcher,
  options?: MatcherOptions,
) {
  checkContainerType(container)
  return queryAllByAttribute(getTestIdAttribute(), container, testId, options)
}

const getMultipleError = (c, id) =>
  `Found multiple elements by: [${getTestIdAttribute()}="${id}"]`
const getMissingError = (c, id) =>
  `Unable to find an element by: [${getTestIdAttribute()}="${id}"]`

const queryAllByTestIdWithSuggestions = wrapAllByQueryWithSuggestion(
  queryAllByTestId,
  queryAllByTestId.name,
  'queryAll',
)

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

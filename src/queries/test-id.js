import {queryAllByAttribute, getConfig, buildQueries} from './all-utils'
import {wrapAllByQueryWithSuggestion} from '../query-helpers'

const getTestIdAttribute = () => getConfig().testIdAttribute

function queryAllByTestId(...args) {
  return queryAllByAttribute(getTestIdAttribute(), ...args)
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

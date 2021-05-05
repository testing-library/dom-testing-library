import {checkContainerType} from '../helpers'
import {wrapAllByQueryWithSuggestion} from '../query-helpers'
import {AllByBoundAttribute, GetErrorFunction} from '../../types'
import {queryAllByAttribute, getConfig, buildQueries} from './all-utils'

const getTestIdAttribute = () => getConfig().testIdAttribute

const queryAllByTestId: AllByBoundAttribute = (...args) => {
  checkContainerType(args[0])
  // TODO: Remove ignore after `queryAllByAttribute` will be moved to TS
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return queryAllByAttribute(getTestIdAttribute(), ...args)
}

const getMultipleError: GetErrorFunction = (c, id) =>
  `Found multiple elements by: [${getTestIdAttribute()}="${id}"]`
const getMissingError: GetErrorFunction = (c, id) =>
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

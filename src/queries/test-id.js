import {queryAllByAttribute, getConfig, buildQueries} from './all-utils'

const getTestIdAttribute = () => getConfig().testIdAttribute

const queryAllByTestId = (...args) =>
  queryAllByAttribute(getTestIdAttribute(), ...args)

const getMultipleError = (c, id) =>
  `Found multiple elements by: [${getTestIdAttribute()}="${id}"]`
const getMissingError = (c, id) =>
  `Unable to find an element by: [${getTestIdAttribute()}="${id}"]`

const [
  queryByTestId,
  getAllByTestId,
  getByTestId,
  findAllByTestId,
  findByTestId,
] = buildQueries(queryAllByTestId, getMultipleError, getMissingError)

export {
  queryByTestId,
  queryAllByTestId,
  getByTestId,
  getAllByTestId,
  findAllByTestId,
  findByTestId,
}

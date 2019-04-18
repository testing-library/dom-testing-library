import {
  queryAllByAttribute,
  makeFindQuery,
  getConfig,
  makeSingleQuery,
  makeGetAllQuery,
} from './all-utils'

const getTestIdAttribute = () => getConfig().testIdAttribute

const queryAllByTestId = (...args) =>
  queryAllByAttribute(getTestIdAttribute(), ...args)

const getMultipleError = (c, id) =>
  `Found multiple elements by: [${getTestIdAttribute()}="${id}"]`
const queryByTestId = makeSingleQuery(queryAllByTestId, getMultipleError)
const getAllByTestId = makeGetAllQuery(
  queryAllByTestId,
  (c, id) => `Unable to find an element by: [${getTestIdAttribute()}="${id}"]`,
)
const getByTestId = makeSingleQuery(getAllByTestId, getMultipleError)

const findByTestId = makeFindQuery(getByTestId)
const findAllByTestId = makeFindQuery(getAllByTestId)

export {
  queryByTestId,
  queryAllByTestId,
  getByTestId,
  getAllByTestId,
  findAllByTestId,
  findByTestId,
}

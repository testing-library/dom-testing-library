import {
  queryAllByAttribute,
  makeSingleQuery,
  makeGetAllQuery,
  makeFindQuery,
} from './all-utils'

const queryAllByRole = queryAllByAttribute.bind(null, 'role')

const getMultipleError = (c, id) => `Found multiple elements by [role=${id}]`
const queryByRole = makeSingleQuery(queryAllByRole, getMultipleError)
const getAllByRole = makeGetAllQuery(
  queryAllByRole,
  (c, id) => `Unable to find an element by [role=${id}]`,
)
const getByRole = makeSingleQuery(getAllByRole, getMultipleError)

const findAllByRole = makeFindQuery(getAllByRole)
const findByRole = makeFindQuery(getByRole)

export {
  queryByRole,
  queryAllByRole,
  getAllByRole,
  getByRole,
  findAllByRole,
  findByRole,
}

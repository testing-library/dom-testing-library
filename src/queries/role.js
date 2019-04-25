import {queryAllByAttribute, buildQueries} from './all-utils'

const queryAllByRole = queryAllByAttribute.bind(null, 'role')

const getMultipleError = (c, id) => `Found multiple elements by [role=${id}]`
const getMissingError = (c, id) => `Unable to find an element by [role=${id}]`

const [
  queryByRole,
  getAllByRole,
  getByRole,
  findAllByRole,
  findByRole,
] = buildQueries(queryAllByRole, getMultipleError, getMissingError)

export {
  queryByRole,
  queryAllByRole,
  getAllByRole,
  getByRole,
  findAllByRole,
  findByRole,
}

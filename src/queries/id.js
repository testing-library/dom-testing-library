import {checkContainerType} from '../helpers'
import {wrapAllByQueryWithSuggestion} from '../query-helpers'
import {queryAllByAttribute, getConfig, buildQueries} from './all-utils'

const getIdAttribute = () => getConfig().idAttribute

function queryAllById(...args) {
  checkContainerType(...args)
  return queryAllByAttribute(getIdAttribute(), ...args)
}

const getMultipleError = (c, id) =>
  `Found multiple elements by: [${getIdAttribute()}="${id}"]`
const getMissingError = (c, id) =>
  `Unable to find an element by: [${getIdAttribute()}="${id}"]`

const queryAllByIdWithSuggestions = wrapAllByQueryWithSuggestion(
  queryAllById,
  queryAllById.name,
  'queryAll',
)

const [queryById, getAllById, getById, findAllById, findById] = buildQueries(
  queryAllById,
  getMultipleError,
  getMissingError,
)

export {
  queryById,
  queryAllByIdWithSuggestions as queryAllById,
  getById,
  getAllById,
  findAllById,
  findById,
}

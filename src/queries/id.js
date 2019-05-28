import {queryAllByAttribute, getConfig, buildQueries} from './all-utils'

const getIdAttribute = () => getConfig().idAttribute

const queryAllById = (...args) => queryAllByAttribute(getIdAttribute(), ...args)

const getMultipleError = (c, id) =>
  `Found multiple elements by: [${getIdAttribute()}="${id}"]`
const getMissingError = (c, id) =>
  `Unable to find an element by: [${getIdAttribute()}="${id}"]`

const [queryById, getAllById, getById, findAllById, findById] = buildQueries(
  queryAllById,
  getMultipleError,
  getMissingError,
)

export {queryById, queryAllById, getById, getAllById, findAllById, findById}

import {queryAllByAttribute, getConfig, buildQueries} from './all-utils'

const getClassAttribute = () => getConfig().classAttribute

const queryAllByClass = (...args) =>
  queryAllByAttribute(getClassAttribute(), ...args)

const getMultipleError = (c, id) =>
  `Found multiple elements by: [${getClassAttribute()}="${id}"]`
const getMissingError = (c, id) =>
  `Unable to find an element by: [${getClassAttribute()}="${id}"]`

const [getAllByClass, findAllByClass] = buildQueries(
  queryAllByClass,
  getMultipleError,
  getMissingError,
)

export {queryAllByClass, getAllByClass, findAllByClass}

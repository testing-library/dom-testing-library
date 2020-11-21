import {getCloseMatchesByAttribute} from '../close-matches'
import {checkContainerType} from '../helpers'
import {wrapAllByQueryWithSuggestion} from '../query-helpers'
import {queryAllByAttribute, getConfig, buildQueries} from './all-utils'

const getTestIdAttribute = () => getConfig().testIdAttribute

function queryAllByTestId(...args) {
  checkContainerType(...args)
  return queryAllByAttribute(getTestIdAttribute(), ...args)
}

const getMultipleError = (c, id) =>
  `Found multiple elements by: [${getTestIdAttribute()}="${id}"]`
const getMissingError = (
  c,
  id,
  {computeCloseMatches = false, ...options} = {},
) => {
  const defaultMessage = `Unable to find an element by: [${getTestIdAttribute()}="${id}"]`
  if (!computeCloseMatches || typeof id !== 'string') {
    return defaultMessage
  }

  const closeMatches = getCloseMatchesByAttribute(
    getTestIdAttribute(),
    c,
    id,
    options,
  )
  return closeMatches.length === 0
    ? defaultMessage
    : `${defaultMessage}. Did you mean one of the following?\n${closeMatches.join(
        '\n',
      )}`
}

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

import {wrapAllByQueryWithSuggestion} from '../query-helpers'
import {checkContainerType} from '../helpers'
import {AllByBoundAttribute, GetErrorFunction} from '../../types'
import {
  getNodeText,
  matches,
  fuzzyMatches,
  makeNormalizer,
  buildQueries,
} from './all-utils'

const queryAllByDisplayValue: AllByBoundAttribute = (
  container,
  value,
  {exact = true, collapseWhitespace, trim, normalizer} = {},
) => {
  checkContainerType(container)
  const matcher = exact ? matches : fuzzyMatches
  const matchNormalizer = makeNormalizer({collapseWhitespace, trim, normalizer})
  return Array.from(
    container.querySelectorAll<HTMLElement>(`input,textarea,select`),
  ).filter(node => {
    if (node.tagName === 'SELECT') {
      const selectedOptions = Array.from(
        (node as HTMLSelectElement).options,
      ).filter(option => option.selected)
      return selectedOptions.some(optionNode =>
        matcher(getNodeText(optionNode), optionNode, value, matchNormalizer),
      )
    } else {
      return matcher(
        (node as HTMLInputElement).value,
        node,
        value,
        matchNormalizer,
      )
    }
  })
}

const getMultipleError: GetErrorFunction = (c, value) =>
  `Found multiple elements with the display value: ${value}.`
const getMissingError: GetErrorFunction = (c, value) =>
  `Unable to find an element with the display value: ${value}.`

const queryAllByDisplayValueWithSuggestions = wrapAllByQueryWithSuggestion(
  queryAllByDisplayValue,
  queryAllByDisplayValue.name,
  'queryAll',
)

const [
  queryByDisplayValue,
  getAllByDisplayValue,
  getByDisplayValue,
  findAllByDisplayValue,
  findByDisplayValue,
] = buildQueries(queryAllByDisplayValue, getMultipleError, getMissingError)

export {
  queryByDisplayValue,
  queryAllByDisplayValueWithSuggestions as queryAllByDisplayValue,
  getByDisplayValue,
  getAllByDisplayValue,
  findAllByDisplayValue,
  findByDisplayValue,
}

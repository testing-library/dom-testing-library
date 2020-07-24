import {wrapAllByQueryWithSuggestion} from '../query-helpers'
import {checkContainerType} from '../helpers'
import {
  getNodeText,
  matches,
  fuzzyMatches,
  makeNormalizer,
  buildQueries,
  Matcher,
  MatcherOptions,
} from './all-utils'

function getElementValue(element: Element): string | undefined {
  return (element as any).value
}

function queryAllByDisplayValue(
  container: HTMLElement,
  value: Matcher,
  {exact = true, collapseWhitespace, trim, normalizer}: MatcherOptions = {},
) {
  checkContainerType(container)
  const matcher = exact ? matches : fuzzyMatches
  const matchNormalizer = makeNormalizer({collapseWhitespace, trim, normalizer})
  return Array.from(container.querySelectorAll(`input,textarea,select`)).filter(
    (node: HTMLElement) => {
      if (node.tagName === 'SELECT') {
        const selectElement = node as HTMLSelectElement
        const selectedOptions = Array.from(selectElement.options).filter(
          option => option.selected,
        )
        return selectedOptions.some(optionNode =>
          matcher(getNodeText(optionNode), optionNode, value, matchNormalizer),
        )
      } else {
        return matcher(getElementValue(node), node, value, matchNormalizer)
      }
    },
  ) as HTMLElement[]
}

const getMultipleError = (c, value) =>
  `Found multiple elements with the display value: ${value}.`
const getMissingError = (c, value) =>
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

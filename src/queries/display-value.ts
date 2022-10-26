import {wrapAllByQueryWithSuggestion} from '../query-helpers'
import {checkContainerType} from '../helpers'
import {
  AllByBoundAttribute,
  GetErrorFunction,
  Matcher,
  MatcherOptions,
} from '../../types'
import {getMatcherHint} from '../hints-helpers'
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

const getMultipleError: GetErrorFunction<[Matcher, MatcherOptions]> = (
  c,
  value,
  options = {},
) => `Found multiple elements ${getMatcherHintOrDefault(value, options)}.`
const getMissingError: GetErrorFunction<[Matcher, MatcherOptions]> = (
  c,
  value,
  options = {},
) => `Unable to find an element ${getMatcherHintOrDefault(value, options)}.`

function getMatcherHintOrDefault(
  matcher: Matcher,
  options: MatcherOptions = {},
) {
  const matcherHint = getMatcherHint(matcher, 'that its display value')

  if (matcherHint) {
    return matcherHint
  }

  const {normalizer} = options
  const matchNormalizer = makeNormalizer({normalizer})
  const normalizedText = matchNormalizer(matcher.toString())
  const isNormalizedDifferent = normalizedText !== matcher.toString()

  return `with the display value: ${
    isNormalizedDifferent
      ? `${normalizedText} (normalized from '${matcher}')`
      : matcher
  }`
}

const queryAllByDisplayValueWithSuggestions = wrapAllByQueryWithSuggestion<
  // @ts-expect-error -- See `wrapAllByQueryWithSuggestion` Argument constraint comment
  [value: Matcher, options?: MatcherOptions]
>(queryAllByDisplayValue, queryAllByDisplayValue.name, 'queryAll')

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

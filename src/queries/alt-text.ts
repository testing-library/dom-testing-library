import {
  queryAllByAttribute,
  wrapAllByQueryWithSuggestion,
} from '../query-helpers'
import {checkContainerType} from '../helpers'
import {
  AllByBoundAttribute,
  GetErrorFunction,
  Matcher,
  MatcherOptions,
  SelectorMatcherOptions,
} from '../../types'
import {getMatcherHint} from '../hints-helpers'
import {buildQueries, makeNormalizer} from './all-utils'

// Valid tags are img, input, area and custom elements
const VALID_TAG_REGEXP = /^(img|input|area|.+-.+)$/i

const queryAllByAltText: AllByBoundAttribute = (
  container,
  alt,
  options: MatcherOptions = {},
) => {
  checkContainerType(container)
  return queryAllByAttribute('alt', container, alt, options).filter(node =>
    VALID_TAG_REGEXP.test(node.tagName),
  )
}

const getMultipleError: GetErrorFunction<[Matcher, MatcherOptions]> = (
  c,
  alt,
  options,
) => {
  return `Found multiple elements ${getMatcherHintOrDefault(alt, options)}`
}
const getMissingError: GetErrorFunction<[Matcher, MatcherOptions]> = (
  c,
  alt,
  options,
) => `Unable to find an element ${getMatcherHintOrDefault(alt, options)}`

function getMatcherHintOrDefault(
  matcher: Matcher,
  options: MatcherOptions = {},
) {
  const matcherHint = getMatcherHint(matcher, 'that its alt text')

  if (matcherHint) {
    return matcherHint
  }

  const {normalizer} = options
  const matchNormalizer = makeNormalizer({normalizer})
  const normalizedText = matchNormalizer(matcher.toString())
  const isNormalizedDifferent = normalizedText !== matcher.toString()

  return `with the alt text: ${
    isNormalizedDifferent
      ? `${normalizedText} (normalized from '${matcher}')`
      : matcher
  }`
}

const queryAllByAltTextWithSuggestions = wrapAllByQueryWithSuggestion<
  // @ts-expect-error -- See `wrapAllByQueryWithSuggestion` Argument constraint comment
  [altText: Matcher, options?: SelectorMatcherOptions]
>(queryAllByAltText, queryAllByAltText.name, 'queryAll')
const [
  queryByAltText,
  getAllByAltText,
  getByAltText,
  findAllByAltText,
  findByAltText,
] = buildQueries(queryAllByAltText, getMultipleError, getMissingError)

export {
  queryByAltText,
  queryAllByAltTextWithSuggestions as queryAllByAltText,
  getByAltText,
  getAllByAltText,
  findAllByAltText,
  findByAltText,
}

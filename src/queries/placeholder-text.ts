import {wrapAllByQueryWithSuggestion} from '../query-helpers'
import {checkContainerType} from '../helpers'
import {
  AllByBoundAttribute,
  GetErrorFunction,
  Matcher,
  MatcherOptions,
} from '../../types'
import {getMatcherHint} from '../hints-helpers'
import {queryAllByAttribute, buildQueries, makeNormalizer} from './all-utils'

const queryAllByPlaceholderText: AllByBoundAttribute = (...args) => {
  checkContainerType(args[0])
  return queryAllByAttribute('placeholder', ...args)
}
const getMultipleError: GetErrorFunction<[Matcher, MatcherOptions]> = (
  c,
  text,
  options = {},
) => `Found multiple elements ${getMatcherHintOrDefault(text, options)}`
const getMissingError: GetErrorFunction<[Matcher, MatcherOptions]> = (
  c,
  text,
  options = {},
) => `Unable to find an element ${getMatcherHintOrDefault(text, options)}`

function getMatcherHintOrDefault(matcher: Matcher, options: MatcherOptions) {
  const matcherHint = getMatcherHint(matcher, 'that its placeholder text')

  if (matcherHint) {
    return matcherHint
  }

  const {normalizer} = options
  const matchNormalizer = makeNormalizer({normalizer})
  const normalizedText = matchNormalizer(matcher.toString())
  const isNormalizedDifferent = normalizedText !== matcher.toString()

  return `with the placeholder text of: ${
    isNormalizedDifferent
      ? `${normalizedText} (normalized from '${matcher}')`
      : matcher
  }`
}

const queryAllByPlaceholderTextWithSuggestions = wrapAllByQueryWithSuggestion<
  // @ts-expect-error -- See `wrapAllByQueryWithSuggestion` Argument constraint comment
  [placeholderText: Matcher, options?: MatcherOptions]
>(queryAllByPlaceholderText, queryAllByPlaceholderText.name, 'queryAll')

const [
  queryByPlaceholderText,
  getAllByPlaceholderText,
  getByPlaceholderText,
  findAllByPlaceholderText,
  findByPlaceholderText,
] = buildQueries(queryAllByPlaceholderText, getMultipleError, getMissingError)

export {
  queryByPlaceholderText,
  queryAllByPlaceholderTextWithSuggestions as queryAllByPlaceholderText,
  getByPlaceholderText,
  getAllByPlaceholderText,
  findAllByPlaceholderText,
  findByPlaceholderText,
}

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
  fuzzyMatches,
  matches,
  makeNormalizer,
  getNodeText,
  buildQueries,
} from './all-utils'

const isSvgTitle = (node: HTMLElement) =>
  node.tagName.toLowerCase() === 'title' &&
  node.parentElement?.tagName.toLowerCase() === 'svg'

const queryAllByTitle: AllByBoundAttribute = (
  container,
  text,
  {exact = true, collapseWhitespace, trim, normalizer} = {},
) => {
  checkContainerType(container)
  const matcher = exact ? matches : fuzzyMatches
  const matchNormalizer = makeNormalizer({collapseWhitespace, trim, normalizer})
  return Array.from(
    container.querySelectorAll<HTMLElement>('[title], svg > title'),
  ).filter(
    node =>
      matcher(node.getAttribute('title'), node, text, matchNormalizer) ||
      (isSvgTitle(node) &&
        matcher(getNodeText(node), node, text, matchNormalizer)),
  )
}

const getMultipleError: GetErrorFunction<[Matcher, MatcherOptions]> = (
  c,
  title,
  options = {},
) => `Found multiple elements ${getMatcherHintOrDefault(title, options)}.`
const getMissingError: GetErrorFunction<[Matcher, MatcherOptions]> = (
  c,
  title,
  options = {},
) => `Unable to find an element ${getMatcherHintOrDefault(title, options)}.`

function getMatcherHintOrDefault(
  matcher: Matcher,
  options: MatcherOptions,
) {
  const matcherHint = getMatcherHint(matcher, 'that its title')

  if (matcherHint) {
    return matcherHint
  }

  const {normalizer} = options
  const matchNormalizer = makeNormalizer({normalizer})
  const normalizedText = matchNormalizer(matcher.toString())
  const isNormalizedDifferent = normalizedText !== matcher.toString()

  return `with the title: ${
    isNormalizedDifferent
      ? `${normalizedText} (normalized from '${matcher}')`
      : matcher
  }`
}

const queryAllByTitleWithSuggestions = wrapAllByQueryWithSuggestion<
  // @ts-expect-error -- See `wrapAllByQueryWithSuggestion` Argument constraint comment
  [title: Matcher, options?: MatcherOptions]
>(queryAllByTitle, queryAllByTitle.name, 'queryAll')

const [queryByTitle, getAllByTitle, getByTitle, findAllByTitle, findByTitle] =
  buildQueries(queryAllByTitle, getMultipleError, getMissingError)

export {
  queryByTitle,
  queryAllByTitleWithSuggestions as queryAllByTitle,
  getByTitle,
  getAllByTitle,
  findAllByTitle,
  findByTitle,
}

import {wrapAllByQueryWithSuggestion} from '../query-helpers'
import {checkContainerType} from '../helpers'
import {
  matches,
  fuzzyMatches,
  makeNormalizer,
  buildQueries,
  MatcherOptions,
  Matcher,
} from './all-utils'

function queryAllByAltText(
  container: HTMLElement,
  alt: Matcher,
  {exact = true, collapseWhitespace, trim, normalizer}: MatcherOptions = {},
) {
  checkContainerType(container)
  const matcher = exact ? matches : fuzzyMatches
  const matchNormalizer = makeNormalizer({collapseWhitespace, trim, normalizer})
  return Array.from(
    container.querySelectorAll('img,input,area'),
  ).filter((node: HTMLElement) =>
    matcher(node.getAttribute('alt'), node, alt, matchNormalizer),
  ) as HTMLElement[]
}

const getMultipleError = (c, alt) =>
  `Found multiple elements with the alt text: ${alt}`
const getMissingError = (c, alt) =>
  `Unable to find an element with the alt text: ${alt}`

const queryAllByAltTextWithSuggestions = wrapAllByQueryWithSuggestion(
  queryAllByAltText,
  queryAllByAltText.name,
  'queryAll',
)
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

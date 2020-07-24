import {wrapAllByQueryWithSuggestion} from '../query-helpers'
import {checkContainerType} from '../helpers'
import {
  fuzzyMatches,
  matches,
  makeNormalizer,
  getNodeText,
  buildQueries,
  Matcher,
  MatcherOptions,
} from './all-utils'

function queryAllByTitle(
  container: HTMLElement,
  text: Matcher,
  {exact = true, collapseWhitespace, trim, normalizer}: MatcherOptions = {},
) {
  checkContainerType(container)
  const matcher = exact ? matches : fuzzyMatches
  const matchNormalizer = makeNormalizer({collapseWhitespace, trim, normalizer})
  return Array.from(container.querySelectorAll('[title], svg > title')).filter(
    (node: HTMLElement) =>
      matcher(node.getAttribute('title'), node, text, matchNormalizer) ||
      matcher(getNodeText(node), node, text, matchNormalizer),
  ) as HTMLElement[]
}

const getMultipleError = (c, title) =>
  `Found multiple elements with the title: ${title}.`
const getMissingError = (c, title) =>
  `Unable to find an element with the title: ${title}.`

const queryAllByTitleWithSuggestions = wrapAllByQueryWithSuggestion(
  queryAllByTitle,
  queryAllByTitle.name,
  'queryAll',
)

const [
  queryByTitle,
  getAllByTitle,
  getByTitle,
  findAllByTitle,
  findByTitle,
] = buildQueries(queryAllByTitle, getMultipleError, getMissingError)

export {
  queryByTitle,
  queryAllByTitleWithSuggestions as queryAllByTitle,
  getByTitle,
  getAllByTitle,
  findAllByTitle,
  findByTitle,
}

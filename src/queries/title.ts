import {wrapAllByQueryWithSuggestion} from '../query-helpers'
import {checkContainerType} from '../helpers'
import {
  AllByBoundAttribute,
  GetErrorFunction,
  Matcher,
  MatcherOptions,
} from '../../types'
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

const getMultipleError: GetErrorFunction<[unknown]> = (c, title) =>
  `Found multiple elements with the title: ${title}.`
const getMissingError: GetErrorFunction<[unknown]> = (c, title) =>
  `Unable to find an element with the title: ${title}.`

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

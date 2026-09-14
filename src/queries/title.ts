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

const getSvgTitleOwner = (node: HTMLElement) => {
  if (
    node.tagName.toLowerCase() !== 'title' ||
    node.namespaceURI !== 'http://www.w3.org/2000/svg'
  ) {
    return null
  }

  const parent = node.parentElement
  if (!parent || parent.tagName.toLowerCase() === 'svg') {
    return node
  }

  return parent
}

const queryAllByTitle: AllByBoundAttribute = (
  container,
  text,
  {exact = true, collapseWhitespace, trim, normalizer} = {},
) => {
  checkContainerType(container)
  const matcher = exact ? matches : fuzzyMatches
  const matchNormalizer = makeNormalizer({collapseWhitespace, trim, normalizer})
  const results = new Set<HTMLElement>()

  Array.from(
    container.querySelectorAll<HTMLElement>('[title], svg title'),
  ).forEach(node => {
    if (matcher(node.getAttribute('title'), node, text, matchNormalizer)) {
      results.add(node)
    }

    const svgTitleOwner = getSvgTitleOwner(node)
    if (
      svgTitleOwner &&
      matcher(getNodeText(node), svgTitleOwner, text, matchNormalizer)
    ) {
      results.add(svgTitleOwner)
    }
  })

  return Array.from(results)
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

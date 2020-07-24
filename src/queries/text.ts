import {
  SelectorMatcherOptions,
  wrapAllByQueryWithSuggestion,
} from '../query-helpers'
import {checkContainerType} from '../helpers'
import {DEFAULT_IGNORE_TAGS} from '../config'
import {
  fuzzyMatches,
  matches,
  makeNormalizer,
  getNodeText,
  buildQueries,
  Matcher,
} from './all-utils'

interface ByTextSelectorMatcherOptions extends SelectorMatcherOptions {
  ignore?: string
}

function queryAllByText(
  container: HTMLElement,
  text: Matcher,
  {
    selector = '*',
    exact = true,
    collapseWhitespace,
    trim,
    ignore = DEFAULT_IGNORE_TAGS,
    normalizer,
  }: ByTextSelectorMatcherOptions = {},
) {
  checkContainerType(container)
  const matcher = exact ? matches : fuzzyMatches
  const matchNormalizer = makeNormalizer({collapseWhitespace, trim, normalizer})
  let baseArray = []
  if (typeof container.matches === 'function' && container.matches(selector)) {
    baseArray = [container]
  }
  return [...baseArray, ...Array.from(container.querySelectorAll(selector))]
    .filter(node => !ignore || !node.matches(ignore))
    .filter(node =>
      matcher(getNodeText(node), node, text, matchNormalizer),
    ) as HTMLElement[]
}

const getMultipleError = (c, text) =>
  `Found multiple elements with the text: ${text}`
const getMissingError = (c, text) =>
  `Unable to find an element with the text: ${text}. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.`

const queryAllByTextWithSuggestions = wrapAllByQueryWithSuggestion(
  queryAllByText,
  queryAllByText.name,
  'queryAll',
)

const [
  queryByText,
  getAllByText,
  getByText,
  findAllByText,
  findByText,
] = buildQueries(queryAllByText, getMultipleError, getMissingError)

export {
  queryByText,
  queryAllByTextWithSuggestions as queryAllByText,
  getByText,
  getAllByText,
  findAllByText,
  findByText,
}

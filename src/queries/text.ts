import {wrapAllByQueryWithSuggestion} from '../query-helpers'
import {checkContainerType} from '../helpers'
import {DEFAULT_IGNORE_TAGS} from '../config'
import {AllByText, GetErrorFunction} from '../../types'
import {
  fuzzyMatches,
  matches,
  makeNormalizer,
  getNodeText,
  buildQueries,
} from './all-utils'

const queryAllByText: AllByText = (
  container,
  text,
  {
    selector = '*',
    exact = true,
    collapseWhitespace,
    trim,
    ignore = DEFAULT_IGNORE_TAGS,
    normalizer,
  } = {},
) => {
  checkContainerType(container)
  const matcher = exact ? matches : fuzzyMatches
  const matchNormalizer = makeNormalizer({collapseWhitespace, trim, normalizer})
  let baseArray: HTMLElement[] = []
  if (typeof container.matches === 'function' && container.matches(selector)) {
    baseArray = [container]
  }
  return (
    [
      ...baseArray,
      ...Array.from(container.querySelectorAll<HTMLElement>(selector)),
    ]
      // TODO: `matches` according lib.dom.d.ts can get only `string` but according our code it can handle also boolean :)
      .filter(node => !ignore || !node.matches(ignore as string))
      .filter(node => matcher(getNodeText(node), node, text, matchNormalizer))
  )
}

const getMultipleError: GetErrorFunction = (c, text) =>
  `Found multiple elements with the text: ${text}`
const getMissingError: GetErrorFunction = (c, text) =>
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

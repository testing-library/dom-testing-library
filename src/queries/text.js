import {
  fuzzyMatches,
  matches,
  makeNormalizer,
  getNodeText,
  makeSingleQuery,
  makeGetAllQuery,
  makeFindQuery,
} from './all-utils'

function queryAllByText(
  container,
  text,
  {
    selector = '*',
    exact = true,
    collapseWhitespace,
    trim,
    ignore = 'script, style',
    normalizer,
  } = {},
) {
  const matcher = exact ? matches : fuzzyMatches
  const matchNormalizer = makeNormalizer({collapseWhitespace, trim, normalizer})
  let baseArray = []
  if (typeof container.matches === 'function' && container.matches(selector)) {
    baseArray = [container]
  }
  return [...baseArray, ...Array.from(container.querySelectorAll(selector))]
    .filter(node => !ignore || !node.matches(ignore))
    .filter(node => matcher(getNodeText(node), node, text, matchNormalizer))
}

const getMultipleError = (c, text) =>
  `Found multiple elements with the text: ${text}`
const queryByText = makeSingleQuery(queryAllByText, getMultipleError)
const getAllByText = makeGetAllQuery(
  queryAllByText,
  (c, text) =>
    `Unable to find an element with the text: ${text}. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.`,
)
const getByText = makeSingleQuery(getAllByText, getMultipleError)
const findByText = makeFindQuery(getByText)
const findAllByText = makeFindQuery(getAllByText)

export {
  queryByText,
  queryAllByText,
  getByText,
  getAllByText,
  findAllByText,
  findByText,
}

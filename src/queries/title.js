import {
  fuzzyMatches,
  matches,
  makeNormalizer,
  getNodeText,
  buildQueries,
} from './all-utils'

function queryAllByTitle(
  container,
  text,
  {exact = true, collapseWhitespace, trim, normalizer} = {},
) {
  const matcher = exact ? matches : fuzzyMatches
  const matchNormalizer = makeNormalizer({collapseWhitespace, trim, normalizer})
  return Array.from(container.querySelectorAll('[title], svg > title')).filter(
    node =>
      matcher(node.getAttribute('title'), node, text, matchNormalizer) ||
      matcher(getNodeText(node), node, text, matchNormalizer),
  )
}

const getMultipleError = (c, title) =>
  `Found multiple elements with the title: ${title}.`
const getMissingError = (c, title) =>
  `Unable to find an element with the title: ${title}.`

const [
  queryByTitle,
  getAllByTitle,
  getByTitle,
  findAllByTitle,
  findByTitle,
] = buildQueries(queryAllByTitle, getMultipleError, getMissingError)

export {
  queryByTitle,
  queryAllByTitle,
  getByTitle,
  getAllByTitle,
  findAllByTitle,
  findByTitle,
}

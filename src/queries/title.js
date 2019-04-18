import {
  fuzzyMatches,
  matches,
  makeNormalizer,
  getNodeText,
  makeFindQuery,
  makeSingleQuery,
  makeGetAllQuery,
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
const queryByTitle = makeSingleQuery(queryAllByTitle, getMultipleError)
const getAllByTitle = makeGetAllQuery(
  queryAllByTitle,
  (c, title) => `Unable to find an element with the title: ${title}.`,
)
const getByTitle = makeSingleQuery(getAllByTitle, getMultipleError)
const findByTitle = makeFindQuery(getByTitle)
const findAllByTitle = makeFindQuery(getAllByTitle)

export {
  queryByTitle,
  queryAllByTitle,
  getByTitle,
  getAllByTitle,
  findAllByTitle,
  findByTitle,
}

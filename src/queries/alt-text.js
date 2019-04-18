import {
  makeFindQuery,
  matches,
  fuzzyMatches,
  makeNormalizer,
  makeSingleQuery,
  makeGetAllQuery,
} from './all-utils'

function queryAllByAltText(
  container,
  alt,
  {exact = true, collapseWhitespace, trim, normalizer} = {},
) {
  const matcher = exact ? matches : fuzzyMatches
  const matchNormalizer = makeNormalizer({collapseWhitespace, trim, normalizer})
  return Array.from(container.querySelectorAll('img,input,area')).filter(node =>
    matcher(node.getAttribute('alt'), node, alt, matchNormalizer),
  )
}

const getMultipleError = (c, alt) =>
  `Found multiple elements with the alt text: ${alt}`
const queryByAltText = makeSingleQuery(queryAllByAltText, getMultipleError)
const getAllByAltText = makeGetAllQuery(
  queryAllByAltText,
  (c, alt) => `Unable to find an element with the alt text: ${alt}`,
)
const getByAltText = makeSingleQuery(getAllByAltText, getMultipleError)

const findAllByAltText = makeFindQuery(getAllByAltText)
const findByAltText = makeFindQuery(getByAltText)

export {
  queryByAltText,
  queryAllByAltText,
  getByAltText,
  getAllByAltText,
  findAllByAltText,
  findByAltText,
}

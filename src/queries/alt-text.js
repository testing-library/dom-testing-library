import {matches, fuzzyMatches, makeNormalizer, buildQueries} from './all-utils'

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
const getMissingError = (c, alt) =>
  `Unable to find an element with the alt text: ${alt}`
const [
  queryByAltText,
  getAllByAltText,
  getByAltText,
  findAllByAltText,
  findByAltText,
] = buildQueries(queryAllByAltText, getMultipleError, getMissingError)

export {
  queryByAltText,
  queryAllByAltText,
  getByAltText,
  getAllByAltText,
  findAllByAltText,
  findByAltText,
}

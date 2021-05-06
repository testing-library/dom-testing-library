import {wrapAllByQueryWithSuggestion} from '../query-helpers'
import {checkContainerType} from '../helpers'
import {AllByBoundAttribute, GetErrorFunction} from '../../types'
import {matches, fuzzyMatches, makeNormalizer, buildQueries} from './all-utils'

const queryAllByAltText: AllByBoundAttribute = (
  container,
  alt,
  {exact = true, collapseWhitespace, trim, normalizer} = {},
) => {
  checkContainerType(container)
  const matcher = exact ? matches : fuzzyMatches
  const matchNormalizer = makeNormalizer({collapseWhitespace, trim, normalizer})
  return Array.from(
    container.querySelectorAll<HTMLElement>('img,input,area'),
  ).filter(node =>
    matcher(node.getAttribute('alt'), node, alt, matchNormalizer),
  )
}

const getMultipleError: GetErrorFunction = (c, alt) =>
  `Found multiple elements with the alt text: ${alt}`
const getMissingError: GetErrorFunction = (c, alt) =>
  `Unable to find an element with the alt text: ${alt}`

const queryAllByAltTextWithSuggestions = wrapAllByQueryWithSuggestion(
  queryAllByAltText,
  queryAllByAltText.name,
  'queryAll',
)
const [
  queryByAltText,
  getAllByAltText,
  getByAltText,
  findAllByAltText,
  findByAltText,
] = buildQueries(queryAllByAltText, getMultipleError, getMissingError)

export {
  queryByAltText,
  queryAllByAltTextWithSuggestions as queryAllByAltText,
  getByAltText,
  getAllByAltText,
  findAllByAltText,
  findByAltText,
}

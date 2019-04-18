import {
  getNodeText,
  matches,
  fuzzyMatches,
  makeNormalizer,
  buildQueries,
} from './all-utils'

function queryAllByDisplayValue(
  container,
  value,
  {exact = true, collapseWhitespace, trim, normalizer} = {},
) {
  const matcher = exact ? matches : fuzzyMatches
  const matchNormalizer = makeNormalizer({collapseWhitespace, trim, normalizer})
  return Array.from(container.querySelectorAll(`input,textarea,select`)).filter(
    node => {
      if (node.tagName === 'SELECT') {
        const selectedOptions = Array.from(node.options).filter(
          option => option.selected,
        )
        return selectedOptions.some(optionNode =>
          matcher(getNodeText(optionNode), optionNode, value, matchNormalizer),
        )
      } else {
        return matcher(node.value, node, value, matchNormalizer)
      }
    },
  )
}

const getMultipleError = (c, value) =>
  `Found multiple elements with the value: ${value}.`
const getMissingError = (c, value) =>
  `Unable to find an element with the value: ${value}.`
const [
  queryByDisplayValue,
  getAllByDisplayValue,
  getByDisplayValue,
  findAllByDisplayValue,
  findByDisplayValue,
] = buildQueries(queryAllByDisplayValue, getMultipleError, getMissingError)

export {
  queryByDisplayValue,
  queryAllByDisplayValue,
  getByDisplayValue,
  getAllByDisplayValue,
  findAllByDisplayValue,
  findByDisplayValue,
}

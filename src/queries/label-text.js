import {getConfig} from '../config'
import {checkContainerType} from '../helpers'
import {
  fuzzyMatches,
  matches,
  makeNormalizer,
  queryAllByAttribute,
  makeFindQuery,
  makeSingleQuery,
  wrapAllByQueryWithSuggestion,
  wrapSingleQueryWithSuggestion,
} from './all-utils'

function queryAllLabels(container) {
  return Array.from(container.querySelectorAll('label,input'))
    .map(node => {
      let textToMatch =
        node.tagName.toLowerCase() === 'label'
          ? node.textContent
          : node.value || null
      // The children of a textarea are part of `textContent` as well. We
      // need to remove them from the string so we can match it afterwards.
      Array.from(node.querySelectorAll('textarea')).forEach(textarea => {
        textToMatch = textToMatch.replace(textarea.value, '')
      })

      // The children of a select are also part of `textContent`, so we
      // need also to remove their text.
      Array.from(node.querySelectorAll('select')).forEach(select => {
        textToMatch = textToMatch.replace(select.textContent, '')
      })
      return {node, textToMatch}
    })
    .filter(({textToMatch}) => textToMatch !== null)
}

function queryAllLabelsByText(
  container,
  text,
  {exact = true, trim, collapseWhitespace, normalizer} = {},
) {
  const matcher = exact ? matches : fuzzyMatches
  const matchNormalizer = makeNormalizer({collapseWhitespace, trim, normalizer})

  const textToMatchByLabels = queryAllLabels(container)

  return textToMatchByLabels
    .filter(({node, textToMatch}) =>
      matcher(textToMatch, node, text, matchNormalizer),
    )
    .map(({node}) => node)
}

function getLabelContent(label) {
  let labelContent = label.getAttribute('value') || label.textContent
  Array.from(label.querySelectorAll('textarea')).forEach(textarea => {
    labelContent = labelContent.replace(textarea.value, '')
  })
  Array.from(label.querySelectorAll('select')).forEach(select => {
    labelContent = labelContent.replace(select.textContent, '')
  })
  return labelContent
}

function queryAllByLabelText(
  container,
  text,
  {selector = '*', exact = true, collapseWhitespace, trim, normalizer} = {},
) {
  checkContainerType(container)

  const matcher = exact ? matches : fuzzyMatches
  const matchNormalizer = makeNormalizer({collapseWhitespace, trim, normalizer})
  const matchingLabelledElements = Array.from(container.querySelectorAll('*'))
    .filter(
      element => element.labels || element.hasAttribute('aria-labelledby'),
    )
    .reduce((labelledElements, labelledElement) => {
      const labelsId = labelledElement.getAttribute('aria-labelledby')
        ? labelledElement.getAttribute('aria-labelledby').split(' ')
        : []
      const labelsValue = labelsId.length
        ? labelsId.map(labelId => {
            const labellingElement = container.querySelector(`[id=${labelId}]`)
            return getLabelContent(labellingElement)
          })
        : Array.from(labelledElement.labels).map(label => {
            const textToMatch = getLabelContent(label)
            const formControlSelector =
              'button, input, meter, output, progress, select, textarea'
            const labelledFormControl = Array.from(
              label.querySelectorAll(formControlSelector),
            ).filter(element => element.matches(selector))[0]
            if (labelledFormControl) {
              if (
                matcher(textToMatch, labelledFormControl, text, matchNormalizer)
              )
                labelledElements.push(labelledFormControl)
            }
            return textToMatch
          })
      if (
        matcher(labelsValue.join(' '), labelledElement, text, matchNormalizer)
      )
        labelledElements.push(labelledElement)
      if (labelsValue.length > 1) {
        labelsValue.forEach((labelValue, index) => {
          if (matcher(labelValue, labelledElement, text, matchNormalizer))
            labelledElements.push(labelledElement)

          const labelsFiltered = [...labelsValue]
          labelsFiltered.splice(index, 1)

          if (labelsFiltered.length > 1) {
            if (
              matcher(
                labelsFiltered.join(' '),
                labelledElement,
                text,
                matchNormalizer,
              )
            )
              labelledElements.push(labelledElement)
          }
        })
      }

      return labelledElements
    }, [])
    .concat(queryAllByAttribute('aria-label', container, text, {exact}))

  return Array.from(new Set(matchingLabelledElements)).filter(element =>
    element.matches(selector),
  )
}

// the getAll* query would normally look like this:
// const getAllByLabelText = makeGetAllQuery(
//   queryAllByLabelText,
//   (c, text) => `Unable to find a label with the text of: ${text}`,
// )
// however, we can give a more helpful error message than the generic one,
// so we're writing this one out by hand.
const getAllByLabelText = (container, text, ...rest) => {
  const els = queryAllByLabelText(container, text, ...rest)
  if (!els.length) {
    const labels = queryAllLabelsByText(container, text, ...rest)
    if (labels.length) {
      throw getConfig().getElementError(
        `Found a label with the text of: ${text}, however no form control was found associated to that label. Make sure you're using the "for" attribute or "aria-labelledby" attribute correctly.`,
        container,
      )
    } else {
      throw getConfig().getElementError(
        `Unable to find a label with the text of: ${text}`,
        container,
      )
    }
  }
  return els
}

// the reason mentioned above is the same reason we're not using buildQueries
const getMultipleError = (c, text) =>
  `Found multiple elements with the text of: ${text}`
const queryByLabelText = wrapSingleQueryWithSuggestion(
  makeSingleQuery(queryAllByLabelText, getMultipleError),
  queryAllByLabelText.name,
  'query',
)
const getByLabelText = makeSingleQuery(getAllByLabelText, getMultipleError)

const findAllByLabelText = makeFindQuery(
  wrapAllByQueryWithSuggestion(
    getAllByLabelText,
    getAllByLabelText.name,
    'findAll',
  ),
)
const findByLabelText = makeFindQuery(
  wrapSingleQueryWithSuggestion(getByLabelText, getByLabelText.name, 'find'),
)

const getAllByLabelTextWithSuggestions = wrapAllByQueryWithSuggestion(
  getAllByLabelText,
  getAllByLabelText.name,
  'getAll',
)
const getByLabelTextWithSuggestions = wrapSingleQueryWithSuggestion(
  getByLabelText,
  getAllByLabelText.name,
  'get',
)

const queryAllByLabelTextWithSuggestions = wrapAllByQueryWithSuggestion(
  queryAllByLabelText,
  queryAllByLabelText.name,
  'queryAll',
)
export {
  queryAllByLabelTextWithSuggestions as queryAllByLabelText,
  queryByLabelText,
  getAllByLabelTextWithSuggestions as getAllByLabelText,
  getByLabelTextWithSuggestions as getByLabelText,
  findAllByLabelText,
  findByLabelText,
}

import {getConfig} from '../config'
import {
  fuzzyMatches,
  matches,
  makeNormalizer,
  queryAllByAttribute,
  makeFindQuery,
  makeSingleQuery,
} from './all-utils'
import {queryAllByText} from './text'

function queryAllLabelsByText(
  container,
  text,
  {exact = true, trim, collapseWhitespace, normalizer} = {},
) {
  const matcher = exact ? matches : fuzzyMatches
  const matchNormalizer = makeNormalizer({collapseWhitespace, trim, normalizer})
  return Array.from(container.querySelectorAll('label')).filter(label => {
    let textToMatch = label.textContent

    // The children of a textarea are part of `textContent` as well. We
    // need to remove them from the string so we can match it afterwards.
    Array.from(label.querySelectorAll('textarea')).forEach(textarea => {
      textToMatch = textToMatch.replace(textarea.value, '')
    })

    // The children of a select are also part of `textContent`, so we
    // need also to remove their text.
    Array.from(label.querySelectorAll('select')).forEach(select => {
      textToMatch = textToMatch.replace(select.textContent, '')
    })

    return matcher(textToMatch, label, text, matchNormalizer)
  })
}

function queryAllByLabelText(
  container,
  text,
  {selector = '*', exact = true, collapseWhitespace, trim, normalizer} = {},
) {
  const matchNormalizer = makeNormalizer({collapseWhitespace, trim, normalizer})
  const labels = queryAllLabelsByText(container, text, {
    exact,
    normalizer: matchNormalizer,
  })
  const labelledElements = labels
    .reduce((matchedElements, label) => {
      const elementsForLabel = []
      if (label.control) {
        elementsForLabel.push(label.control)
      }
      /* istanbul ignore if */
      if (label.getAttribute('for')) {
        // we're using this notation because with the # selector we would have to escape special characters e.g. user.name
        // see https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector#Escaping_special_characters
        // <label for="someId">text</label><input id="someId" />

        // .control support has landed in jsdom (https://github.com/jsdom/jsdom/issues/2175)
        elementsForLabel.push(
          container.querySelector(`[id="${label.getAttribute('for')}"]`),
        )
      }
      if (label.getAttribute('id')) {
        // <label id="someId">text</label><input aria-labelledby="someId" />
        Array.from(
          container.querySelectorAll(
            `[aria-labelledby~="${label.getAttribute('id')}"]`,
          ),
        ).forEach(element => elementsForLabel.push(element))
      }
      if (label.childNodes.length) {
        // <label>text: <input /></label>
        const formControlSelector =
          'button, input, meter, output, progress, select, textarea'
        const labelledFormControl = Array.from(
          label.querySelectorAll(formControlSelector),
        ).filter(element => element.matches(selector))[0]
        if (labelledFormControl) elementsForLabel.push(labelledFormControl)
      }
      return matchedElements.concat(elementsForLabel)
    }, [])
    .filter(element => element !== null)
    .concat(queryAllByAttribute('aria-label', container, text, {exact}))

  const possibleAriaLabelElements = queryAllByText(container, text, {
    exact,
    normalizer: matchNormalizer,
  })

  const ariaLabelledElements = possibleAriaLabelElements.reduce(
    (allLabelledElements, nextLabelElement) => {
      const labelId = nextLabelElement.getAttribute('id')

      if (!labelId) return allLabelledElements

      // ARIA labels can label multiple elements
      const labelledNodes = Array.from(
        container.querySelectorAll(`[aria-labelledby~="${labelId}"]`),
      )

      return allLabelledElements.concat(labelledNodes)
    },
    [],
  )

  return Array.from(
    new Set([...labelledElements, ...ariaLabelledElements]),
  ).filter(element => element.matches(selector))
}

// the getAll* query would normally look like this:
// const getAllByLabelText = makeGetAllQuery(
//   queryAllByLabelText,
//   (c, text) => `Unable to find a label with the text of: ${text}`,
// )
// however, we can give a more helpful error message than the generic one,
// so we're writing this one out by hand.
function getAllByLabelText(container, text, ...rest) {
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
const queryByLabelText = makeSingleQuery(queryAllByLabelText, getMultipleError)
const getByLabelText = makeSingleQuery(getAllByLabelText, getMultipleError)

const findAllByLabelText = makeFindQuery(getAllByLabelText)
const findByLabelText = makeFindQuery(getByLabelText)

export {
  queryAllByLabelText,
  queryByLabelText,
  getAllByLabelText,
  getByLabelText,
  findAllByLabelText,
  findByLabelText,
}

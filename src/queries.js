import {fuzzyMatches, matches} from './matches'
import {getNodeText} from './get-node-text'
import {prettyDOM} from './pretty-dom'

function debugDOM(htmlElement) {
  return prettyDOM(htmlElement, process.env.DEBUG_PRINT_LIMIT || 7000)
}

// Here are the queries for the library.
// The queries here should only be things that are accessible to both users who are using a screen reader
// and those who are not using a screen reader (with the exception of the data-testid attribute query).

function firstResultOrNull(queryFunction, ...args) {
  const result = queryFunction(...args)
  if (result.length === 0) return null
  return result[0]
}

function queryAllLabelsByText(
  container,
  text,
  {exact = true, trim = true, collapseWhitespace = true} = {},
) {
  const matcher = exact ? matches : fuzzyMatches
  const matchOpts = {collapseWhitespace, trim}
  return Array.from(container.querySelectorAll('label')).filter(label =>
    matcher(label.textContent, label, text, matchOpts),
  )
}

function queryAllByLabelText(
  container,
  text,
  {selector = '*', exact = true, collapseWhitespace = true, trim = true} = {},
) {
  const matchOpts = {collapseWhitespace, trim}
  const labels = queryAllLabelsByText(container, text, {exact, ...matchOpts})
  const labelledElements = labels
    .map(label => {
      /* istanbul ignore if */
      if (label.control) {
        // appears to be unsupported in jsdom: https://github.com/jsdom/jsdom/issues/2175
        // but this would be the proper way to do things
        return label.control
      } else if (label.getAttribute('for')) {
        // we're using this notation because with the # selector we would have to escape special characters e.g. user.name
        // see https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector#Escaping_special_characters
        // <label for="someId">text</label><input id="someId" />
        return container.querySelector(`[id="${label.getAttribute('for')}"]`)
      } else if (label.getAttribute('id')) {
        // <label id="someId">text</label><input aria-labelledby="someId" />
        return container.querySelector(
          `[aria-labelledby="${label.getAttribute('id')}"]`,
        )
      } else if (label.childNodes.length) {
        // <label>text: <input /></label>
        return label.querySelector(selector)
      } else {
        return null
      }
    })
    .filter(label => label !== null)
    .concat(queryAllByAttribute('aria-label', container, text, {exact}))

  return labelledElements
}

function queryByLabelText(...args) {
  return firstResultOrNull(queryAllByLabelText, ...args)
}

function queryAllByText(
  container,
  text,
  {selector = '*', exact = true, collapseWhitespace = true, trim = true} = {},
) {
  const matcher = exact ? matches : fuzzyMatches
  const matchOpts = {collapseWhitespace, trim}
  return Array.from(container.querySelectorAll(selector)).filter(node =>
    matcher(getNodeText(node), node, text, matchOpts),
  )
}

function queryByText(...args) {
  return firstResultOrNull(queryAllByText, ...args)
}

// this is just a utility and not an exposed query.
// There are no plans to expose this.
function queryAllByAttribute(
  attribute,
  container,
  text,
  {exact = true, collapseWhitespace = true, trim = true} = {},
) {
  const matcher = exact ? matches : fuzzyMatches
  const matchOpts = {collapseWhitespace, trim}
  return Array.from(container.querySelectorAll(`[${attribute}]`)).filter(node =>
    matcher(node.getAttribute(attribute), node, text, matchOpts),
  )
}

// this is just a utility and not an exposed query.
// There are no plans to expose this.
function queryByAttribute(...args) {
  return firstResultOrNull(queryAllByAttribute, ...args)
}

const queryByPlaceholderText = queryByAttribute.bind(null, 'placeholder')
const queryAllByPlaceholderText = queryAllByAttribute.bind(null, 'placeholder')
const queryByTestId = queryByAttribute.bind(null, 'data-testid')
const queryAllByTestId = queryAllByAttribute.bind(null, 'data-testid')
const queryByTitle = queryByAttribute.bind(null, 'title')
const queryAllByTitle = queryAllByAttribute.bind(null, 'title')

function queryAllByAltText(
  container,
  alt,
  {exact = true, collapseWhitespace = true, trim = true} = {},
) {
  const matcher = exact ? matches : fuzzyMatches
  const matchOpts = {collapseWhitespace, trim}
  return Array.from(container.querySelectorAll('img,input,area')).filter(node =>
    matcher(node.getAttribute('alt'), node, alt, matchOpts),
  )
}

function queryByAltText(...args) {
  return firstResultOrNull(queryAllByAltText, ...args)
}

// getters
// the reason we're not dynamically generating these functions that look so similar:
// 1. The error messages are specific to each one and depend on arguments
// 2. The stack trace will look better because it'll have a helpful method name.

function getAllByTestId(container, id, ...rest) {
  const els = queryAllByTestId(container, id, ...rest)
  if (!els.length) {
    throw new Error(
      `Unable to find an element by: [data-testid="${id}"] \n\n${debugDOM(
        container,
      )}`,
    )
  }
  return els
}

function getByTestId(...args) {
  return firstResultOrNull(getAllByTestId, ...args)
}

function getAllByTitle(container, title, ...rest) {
  const els = queryAllByTitle(container, title, ...rest)
  if (!els.length) {
    throw new Error(
      `Unable to find an element with the title: ${title}. \n\n${debugDOM(
        container,
      )}`,
    )
  }
  return els
}

function getByTitle(...args) {
  return firstResultOrNull(getAllByTitle, ...args)
}

function getAllByPlaceholderText(container, text, ...rest) {
  const els = queryAllByPlaceholderText(container, text, ...rest)
  if (!els.length) {
    throw new Error(
      `Unable to find an element with the placeholder text of: ${text} \n\n${debugDOM(
        container,
      )}`,
    )
  }
  return els
}

function getByPlaceholderText(...args) {
  return firstResultOrNull(getAllByPlaceholderText, ...args)
}

function getAllByLabelText(container, text, ...rest) {
  const els = queryAllByLabelText(container, text, ...rest)
  if (!els.length) {
    const labels = queryAllLabelsByText(container, text, ...rest)
    if (labels.length) {
      throw new Error(
        `Found a label with the text of: ${text}, however no form control was found associated to that label. Make sure you're using the "for" attribute or "aria-labelledby" attribute correctly. \n\n${debugDOM(
          container,
        )}`,
      )
    } else {
      throw new Error(
        `Unable to find a label with the text of: ${text} \n\n${debugDOM(
          container,
        )}`,
      )
    }
  }
  return els
}

function getByLabelText(...args) {
  return firstResultOrNull(getAllByLabelText, ...args)
}

function getAllByText(container, text, ...rest) {
  const els = queryAllByText(container, text, ...rest)
  if (!els.length) {
    throw new Error(
      `Unable to find an element with the text: ${text}. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible. \n\n${debugDOM(
        container,
      )}`,
    )
  }
  return els
}

function getByText(...args) {
  return firstResultOrNull(getAllByText, ...args)
}

function getAllByAltText(container, alt, ...rest) {
  const els = queryAllByAltText(container, alt, ...rest)
  if (!els.length) {
    throw new Error(
      `Unable to find an element with the alt text: ${alt} \n\n${debugDOM(
        container,
      )}`,
    )
  }
  return els
}

function getByAltText(...args) {
  return firstResultOrNull(getAllByAltText, ...args)
}

export {
  queryByPlaceholderText,
  queryAllByPlaceholderText,
  getByPlaceholderText,
  getAllByPlaceholderText,
  queryByText,
  queryAllByText,
  getByText,
  getAllByText,
  queryByLabelText,
  queryAllByLabelText,
  getByLabelText,
  getAllByLabelText,
  queryByAltText,
  queryAllByAltText,
  getByAltText,
  getAllByAltText,
  queryByTestId,
  queryAllByTestId,
  getByTestId,
  getAllByTestId,
  queryByTitle,
  queryAllByTitle,
  getByTitle,
  getAllByTitle,
}

/* eslint complexity:["error", 14] */

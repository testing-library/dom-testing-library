import {matches} from './matches'
import {getNodeText} from './get-node-text'
import {prettyDOM} from './pretty-dom'

function debugDOM(htmlElement) {
  return prettyDOM(htmlElement, process.env.DEBUG_PRINT_LIMIT || 7000)
}

// Here are the queries for the library.
// The queries here should only be things that are accessible to both users who are using a screen reader
// and those who are not using a screen reader (with the exception of the data-testid attribute query).

function queryLabelByText(container, text) {
  return (
    Array.from(container.querySelectorAll('label')).find(label =>
      matches(label.textContent, label, text),
    ) || null
  )
}

function queryByLabelText(container, text, {selector = '*'} = {}) {
  const label = queryLabelByText(container, text)
  if (!label) {
    return queryByAttribute('aria-label', container, text)
  }
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
}

function queryByText(container, text, {selector = '*'} = {}) {
  return (
    Array.from(container.querySelectorAll(selector)).find(node =>
      matches(getNodeText(node), node, text),
    ) || null
  )
}

// this is just a utility and not an exposed query.
// There are no plans to expose this.
function queryByAttribute(attribute, container, text) {
  return (
    Array.from(container.querySelectorAll(`[${attribute}]`)).find(node =>
      matches(node.getAttribute(attribute), node, text),
    ) || null
  )
}

const queryByPlaceholderText = queryByAttribute.bind(null, 'placeholder')
const queryByTestId = queryByAttribute.bind(null, 'data-testid')

// getters
// the reason we're not dynamically generating these functions that look so similar:
// 1. The error messages are specific to each one and depend on arguments
// 2. The stack trace will look better because it'll have a helpful method name.

function getByTestId(container, id, ...rest) {
  const el = queryByTestId(container, id, ...rest)
  if (!el) {
    throw new Error(
      `Unable to find an element by: [data-testid="${id}"] \n\n${debugDOM(
        container,
      )}`,
    )
  }
  return el
}

function getByPlaceholderText(container, text, ...rest) {
  const el = queryByPlaceholderText(container, text, ...rest)
  if (!el) {
    throw new Error(
      `Unable to find an element with the placeholder text of: ${text} \n\n${debugDOM(
        container,
      )}`,
    )
  }
  return el
}

function getByLabelText(container, text, ...rest) {
  const el = queryByLabelText(container, text, ...rest)
  if (!el) {
    const label = queryLabelByText(container, text)
    if (label) {
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
  return el
}

function getByText(container, text, ...rest) {
  const el = queryByText(container, text, ...rest)
  if (!el) {
    throw new Error(
      `Unable to find an element with the text: ${text}. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible. \n\n${debugDOM(
        container,
      )}`,
    )
  }
  return el
}

function queryByAltText(container, alt) {
  return (
    Array.from(container.querySelectorAll('img,input,area')).find(node =>
      matches(node.getAttribute('alt'), node, alt),
    ) || null
  )
}

function getByAltText(container, alt) {
  const el = queryByAltText(container, alt)
  if (!el) {
    throw new Error(
      `Unable to find an element with the alt text: ${alt} \n\n${debugDOM(
        container,
      )}`,
    )
  }
  return el
}

export {
  queryByPlaceholderText,
  getByPlaceholderText,
  queryByText,
  getByText,
  queryByLabelText,
  getByLabelText,
  queryByAltText,
  getByAltText,
  queryByTestId,
  getByTestId,
}

/* eslint complexity:["error", 14] */

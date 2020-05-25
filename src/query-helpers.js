import {getSuggestedQuery} from './suggestions'
import {fuzzyMatches, matches, makeNormalizer} from './matches'
import {waitFor} from './wait-for'
import {getConfig} from './config'

function getElementError(message, container) {
  return getConfig().getElementError(message, container)
}

function getMultipleElementsFoundError(message, container) {
  return getElementError(
    `${message}\n\n(If this is intentional, then use the \`*AllBy*\` variant of the query (like \`queryAllByText\`, \`getAllByText\`, or \`findAllByText\`)).`,
    container,
  )
}

function queryAllByAttribute(
  attribute,
  container,
  text,
  {exact = true, collapseWhitespace, trim, normalizer} = {},
) {
  const matcher = exact ? matches : fuzzyMatches
  const matchNormalizer = makeNormalizer({collapseWhitespace, trim, normalizer})
  return Array.from(container.querySelectorAll(`[${attribute}]`)).filter(node =>
    matcher(node.getAttribute(attribute), node, text, matchNormalizer),
  )
}

function queryByAttribute(attribute, container, text, ...args) {
  const els = queryAllByAttribute(attribute, container, text, ...args)
  if (els.length > 1) {
    throw getMultipleElementsFoundError(
      `Found multiple elements by [${attribute}=${text}]`,
      container,
    )
  }
  return els[0] || null
}

// this accepts a query function and returns a function which throws an error
// if more than one elements is returned, otherwise it returns the first
// element or null
function makeSingleQuery(allQuery, getMultipleError) {
  return (container, ...args) => {
    const els = allQuery(container, ...args)
    if (els.length > 1) {
      throw getMultipleElementsFoundError(
        getMultipleError(container, ...args),
        container,
      )
    }
    const element = els[0] || null

    if (getConfig().showSuggestions) {
      const suggestion = getSuggestedQuery(element)
      if (suggestion && !allQuery.name.endsWith(suggestion.queryName)) {
        throw getSuggestionError(suggestion.toString(), container)
      }
    }
    return element
  }
}

function getSuggestionError(suggestion, container) {
  return getConfig().getElementError(
    `A better query is available, try this:
*By${suggestion.toString()}
`,
    container,
  )
}

// this accepts a query function and returns a function which throws an error
// if an empty list of elements is returned
function makeGetAllQuery(allQuery, getMissingError) {
  return (container, ...args) => {
    const els = allQuery(container, ...args)
    if (!els.length) {
      throw getConfig().getElementError(
        getMissingError(container, ...args),
        container,
      )
    }
    if (getConfig().showSuggestions) {
      //get a unique list of all suggestion messages.  We are only going to make a suggestion if
      // all the suggestions are the same
      const uniqueSuggestionMessages = [
        ...new Set(els.map(element => getSuggestedQuery(element)?.toString())),
      ]

      if (
        // only want to suggest if all the els have the same suggestion.
        uniqueSuggestionMessages.length === 1 &&
        !allQuery.name.endsWith(getSuggestedQuery(els[0]).queryName)
      ) {
        throw getSuggestionError(uniqueSuggestionMessages[0], container)
      }
    }
    return els
  }
}

// this accepts a getter query function and returns a function which calls
// waitFor and passing a function which invokes the getter.
function makeFindQuery(getter) {
  return (container, text, options, waitForOptions) =>
    waitFor(() => getter(container, text, options), waitForOptions)
}

function buildQueries(queryAllBy, getMultipleError, getMissingError) {
  const queryBy = makeSingleQuery(queryAllBy, getMultipleError)
  const getAllBy = makeGetAllQuery(queryAllBy, getMissingError)
  // Suggestions need to know how they're being used, so need to set the name of the allQuery
  Object.defineProperty(getAllBy, 'name', {
    value: queryAllBy.name.replace('query', 'get'),
  })
  const getBy = makeSingleQuery(getAllBy, getMultipleError)
  const findAllBy = makeFindQuery(getAllBy)
  const findBy = makeFindQuery(getBy)

  return [queryBy, getAllBy, getBy, findAllBy, findBy]
}

export {
  getElementError,
  getMultipleElementsFoundError,
  queryAllByAttribute,
  queryByAttribute,
  makeSingleQuery,
  makeGetAllQuery,
  makeFindQuery,
  buildQueries,
}

import {prettyDOM} from './pretty-dom'
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
      const elementStrings = els.map(element => prettyDOM(element)).join('\n\n')

      throw getMultipleElementsFoundError(
        `${getMultipleError(container, ...args)}

Here are the matching elements:

${elementStrings}`,
        container,
      )
    }
    return els[0] || null
  }
}

function getSuggestionError(suggestion, container) {
  return getConfig().getElementError(
    `A better query is available, try this:
${suggestion.toString()}
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

    return els
  }
}

// this accepts a getter query function and returns a function which calls
// waitFor and passing a function which invokes the getter.
function makeFindQuery(getter) {
  return (container, text, options, waitForOptions) =>
    waitFor(() => {
      return getter(container, text, options)
    }, waitForOptions)
}

const wrapSingleQueryWithSuggestion = (query, queryAllByName, variant) => (
  container,
  ...args
) => {
  const element = query(container, ...args)
  const [{suggest = getConfig().throwSuggestions} = {}] = args.slice(-1)
  if (element && suggest) {
    const suggestion = getSuggestedQuery(element, variant)
    if (suggestion && !queryAllByName.endsWith(suggestion.queryName)) {
      throw getSuggestionError(suggestion.toString(), container)
    }
  }

  return element
}

const wrapAllByQueryWithSuggestion = (query, queryAllByName, variant) => (
  container,
  ...args
) => {
  const els = query(container, ...args)

  const [{suggest = getConfig().throwSuggestions} = {}] = args.slice(-1)
  if (els.length && suggest) {
    // get a unique list of all suggestion messages.  We are only going to make a suggestion if
    // all the suggestions are the same
    const uniqueSuggestionMessages = [
      ...new Set(
        els.map(element => getSuggestedQuery(element, variant)?.toString()),
      ),
    ]

    if (
      // only want to suggest if all the els have the same suggestion.
      uniqueSuggestionMessages.length === 1 &&
      !queryAllByName.endsWith(getSuggestedQuery(els[0], variant).queryName)
    ) {
      throw getSuggestionError(uniqueSuggestionMessages[0], container)
    }
  }

  return els
}

function buildQueries(queryAllBy, getMultipleError, getMissingError) {
  const queryBy = wrapSingleQueryWithSuggestion(
    makeSingleQuery(queryAllBy, getMultipleError),
    queryAllBy.name,
    'query',
  )
  const getAllBy = makeGetAllQuery(queryAllBy, getMissingError)

  const getBy = makeSingleQuery(getAllBy, getMultipleError)
  const getByWithSuggestions = wrapSingleQueryWithSuggestion(
    getBy,
    queryAllBy.name,
    'get',
  )
  const getAllWithSuggestions = wrapAllByQueryWithSuggestion(
    getAllBy,
    queryAllBy.name.replace('query', 'get'),
    'getAll',
  )

  const findAllBy = makeFindQuery(
    wrapAllByQueryWithSuggestion(getAllBy, queryAllBy.name, 'findAll'),
  )
  const findBy = makeFindQuery(
    wrapSingleQueryWithSuggestion(getBy, queryAllBy.name, 'find'),
  )

  return [
    queryBy,
    getAllWithSuggestions,
    getByWithSuggestions,
    findAllBy,
    findBy,
  ]
}

export {
  getElementError,
  wrapAllByQueryWithSuggestion,
  wrapSingleQueryWithSuggestion,
  getMultipleElementsFoundError,
  queryAllByAttribute,
  queryByAttribute,
  makeSingleQuery,
  makeGetAllQuery,
  makeFindQuery,
  buildQueries,
}

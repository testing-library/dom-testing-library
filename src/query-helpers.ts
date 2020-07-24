import {getSuggestedQuery} from './suggestions'
import {
  fuzzyMatches,
  matches,
  makeNormalizer,
  Matcher,
  MatcherOptions,
} from './matches'
import {waitFor, WaitForOptions} from './wait-for'
import {getConfig} from './config'

export interface SelectorMatcherOptions extends MatcherOptions {
  ignore?: string
  selector?: string
}

function getElementError(message: string, container: HTMLElement): Error {
  return getConfig().getElementError(message, container)
}

function getMultipleElementsFoundError(
  message: string,
  container: HTMLElement,
): Error {
  return getElementError(
    `${message}\n\n(If this is intentional, then use the \`*AllBy*\` variant of the query (like \`queryAllByText\`, \`getAllByText\`, or \`findAllByText\`)).`,
    container,
  )
}

function queryAllByAttribute(
  attribute: string,
  container: HTMLElement,
  text: Matcher,
  {exact = true, collapseWhitespace, trim, normalizer}: MatcherOptions = {},
): HTMLElement[] {
  const matcher = exact ? matches : fuzzyMatches
  const matchNormalizer = makeNormalizer({collapseWhitespace, trim, normalizer})
  return Array.from(container.querySelectorAll(`[${attribute}]`)).filter(node =>
    matcher(
      node.getAttribute(attribute),
      node as HTMLElement,
      text,
      matchNormalizer,
    ),
  ) as HTMLElement[]
}

function queryByAttribute(
  attribute: string,
  container: HTMLElement,
  text: Matcher,
  options?: MatcherOptions,
): HTMLElement | null {
  const els = queryAllByAttribute(attribute, container, text, options)
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
      // @ts-ignore FIXME with the right tsconfig settings
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

/**
 * query methods have a common call signature. Only the return type differs.
 */
export type QueryMethod<Arguments extends any[], Return> = (
  container: HTMLElement,
  ...args: Arguments
) => Return
export type QueryBy<Arguments extends any[]> = QueryMethod<
  Arguments,
  HTMLElement | null
>
export type GetAllBy<Arguments extends any[]> = QueryMethod<
  Arguments,
  HTMLElement[]
>
export type FindAllBy<Arguments extends any[]> = QueryMethod<
  [Arguments[0], Arguments[1], WaitForOptions],
  Promise<HTMLElement[]>
>
export type GetBy<Arguments extends any[]> = QueryMethod<Arguments, HTMLElement>
export type FindBy<Arguments extends any[]> = QueryMethod<
  [Arguments[0], Arguments[1], WaitForOptions],
  Promise<HTMLElement>
>
export type BuiltQueryMethods<Arguments extends any[]> = [
  QueryBy<Arguments>,
  GetAllBy<Arguments>,
  GetBy<Arguments>,
  FindAllBy<Arguments>,
  FindBy<Arguments>,
]

function buildQueries<Arguments extends any[]>(
  queryAllBy: GetAllBy<Arguments>,
  getMultipleError: (container: HTMLElement, ...args: Arguments) => string,
  getMissingError: (container: HTMLElement, ...args: Arguments) => string,
): BuiltQueryMethods<Arguments> {
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

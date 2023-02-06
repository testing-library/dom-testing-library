import {
  type GetErrorFunction,
  type Matcher,
  type MatcherOptions,
  type QueryMethod,
  type Variant,
  type waitForOptions as WaitForOptions,
  type WithSuggest,
} from '../types'
import {getSuggestedQuery} from './suggestions'
import {fuzzyMatches, matches, makeNormalizer} from './matches'
import {waitFor} from './wait-for'
import {getConfig} from './config'

function getElementError(message: string | null, container: HTMLElement) {
  return getConfig().getElementError(message, container)
}

function getMultipleElementsFoundError(
  message: string,
  container: HTMLElement,
) {
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
  return Array.from(
    container.querySelectorAll<HTMLElement>(`[${attribute}]`),
  ).filter(node =>
    matcher(node.getAttribute(attribute), node, text, matchNormalizer),
  )
}

function queryByAttribute(
  attribute: string,
  container: HTMLElement,
  text: Matcher,
  options?: MatcherOptions,
) {
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
function makeSingleQuery<Arguments extends unknown[]>(
  allQuery: QueryMethod<Arguments, HTMLElement[]>,
  getMultipleError: GetErrorFunction<Arguments>,
) {
  return (container: HTMLElement, ...args: Arguments) => {
    const els = allQuery(container, ...args)
    if (els.length > 1) {
      const elementStrings = els
        .map(element => getElementError(null, element).message)
        .join('\n\n')

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

function getSuggestionError(
  suggestion: {toString(): string},
  container: HTMLElement,
) {
  return getConfig().getElementError(
    `A better query is available, try this:
${suggestion.toString()}
`,
    container,
  )
}

// this accepts a query function and returns a function which throws an error
// if an empty list of elements is returned
function makeGetAllQuery<Arguments extends unknown[]>(
  allQuery: (container: HTMLElement, ...args: Arguments) => HTMLElement[],
  getMissingError: GetErrorFunction<Arguments>,
) {
  return (container: HTMLElement, ...args: Arguments) => {
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
function makeFindQuery<QueryFor, QueryMatcher>(
  getter: (
    container: HTMLElement,
    text: QueryMatcher,
    options: MatcherOptions,
  ) => QueryFor,
) {
  return (
    container: HTMLElement,
    text: QueryMatcher,
    options: MatcherOptions,
    waitForOptions: WaitForOptions,
  ) => {
    return waitFor(
      () => {
        return getter(container, text, options)
      },
      {container, ...waitForOptions},
    )
  }
}

const wrapSingleQueryWithSuggestion =
  <Arguments extends [...unknown[], WithSuggest]>(
    query: (container: HTMLElement, ...args: Arguments) => HTMLElement | null,
    queryAllByName: string,
    variant: Variant,
  ) =>
  (container: HTMLElement, ...args: Arguments) => {
    const element = query(container, ...args)
    const [{suggest = getConfig().throwSuggestions} = {}] = args.slice(-1) as [
      WithSuggest,
    ]
    if (element && suggest) {
      const suggestion = getSuggestedQuery(element, variant)
      if (
        suggestion &&
        !queryAllByName.endsWith(suggestion.queryName as string)
      ) {
        throw getSuggestionError(suggestion.toString(), container)
      }
    }

    return element
  }

const wrapAllByQueryWithSuggestion =
  <
    // We actually want `Arguments extends [args: ...unknown[], options?: Options]`
    // But that's not supported by TS so we have to `@ts-expect-error` every callsite
    Arguments extends [...unknown[], WithSuggest],
  >(
    query: (container: HTMLElement, ...args: Arguments) => HTMLElement[],
    queryAllByName: string,
    variant: Variant,
  ) =>
  (container: HTMLElement, ...args: Arguments) => {
    const els = query(container, ...args)

    const [{suggest = getConfig().throwSuggestions} = {}] = args.slice(-1) as [
      WithSuggest,
    ]
    if (els.length && suggest) {
      // get a unique list of all suggestion messages.  We are only going to make a suggestion if
      // all the suggestions are the same
      const uniqueSuggestionMessages = [
        ...new Set(
          els.map(
            element =>
              getSuggestedQuery(element, variant)?.toString() as string,
          ),
        ),
      ]

      if (
        // only want to suggest if all the els have the same suggestion.
        uniqueSuggestionMessages.length === 1 &&
        !queryAllByName.endsWith(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- TODO: Can this be null at runtime?
          getSuggestedQuery(els[0], variant)!.queryName as string,
        )
      ) {
        throw getSuggestionError(uniqueSuggestionMessages[0], container)
      }
    }

    return els
  }

// TODO: This deviates from the published declarations
// However, the implementation always required a dyadic (after `container`) not variadic `queryAllBy` considering the implementation of `makeFindQuery`
// This is at least statically true and can be verified by accepting `QueryMethod<Arguments, HTMLElement[]>`
function buildQueries<QueryMatcher>(
  queryAllBy: QueryMethod<
    [matcher: QueryMatcher, options: MatcherOptions],
    HTMLElement[]
  >,
  getMultipleError: GetErrorFunction<
    [matcher: QueryMatcher, options: MatcherOptions]
  >,
  getMissingError: GetErrorFunction<
    [matcher: QueryMatcher, options: MatcherOptions]
  >,
) {
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

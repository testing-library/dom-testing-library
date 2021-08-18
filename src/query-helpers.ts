import type {
  AllByAttribute,
  BuiltQueryMethods,
  FindAllBy,
  FindBy,
  GetAllBy,
  GetBy,
  getElementError as GetElementError,
  GetErrorFunction,
  Matcher,
  MatcherOptions,
  QueryBy,
  QueryByAttribute,
  Suggestion,
  Variant,
  waitForOptions as WaitForOptions,
  WithSuggest,
} from '../types'
import {getConfig} from './config'
import {fuzzyMatches, makeNormalizer, matches} from './matches'
import {getSuggestedQuery} from './suggestions'
import {waitFor} from './wait-for'

const getElementError: typeof GetElementError = (
  message: string | null,
  container: HTMLElement,
): Error => {
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

const queryAllByAttribute: AllByAttribute = (
  attribute: string,
  container: HTMLElement,
  text: Matcher,
  options: MatcherOptions = {},
): HTMLElement[] => {
  const {exact = true, collapseWhitespace, trim, normalizer} = options
  const matcher = exact ? matches : fuzzyMatches
  const matchNormalizer = makeNormalizer({collapseWhitespace, trim, normalizer})
  return Array.from(
    container.querySelectorAll<HTMLElement>(`[${attribute}]`),
  ).filter(node =>
    matcher(node.getAttribute(attribute), node, text, matchNormalizer),
  )
}

const queryByAttribute: QueryByAttribute = (
  attribute: string,
  container: HTMLElement,
  text: Matcher,
  options?: MatcherOptions,
): HTMLElement => {
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
// Arguments is a tuple of unknown params
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeSingleQuery<Arguments extends [...any, {}?]>(
  allQuery: {
    (container: HTMLElement, ...args: Arguments): HTMLElement[]
  },
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

function getSuggestionError(suggestion: string, container: HTMLElement) {
  return getConfig().getElementError(
    `A better query is available, try this:
${suggestion.toString()}
`,
    container,
  )
}

// this accepts a query function and returns a function which throws an error
// if an empty list of elements is returned
// Arguments is a tuple of unknown params
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeGetAllQuery<Arguments extends [...any, {}?]>(
  allQuery: (arg0: HTMLElement, ...args: Arguments) => HTMLElement[],
  getMissingError: GetErrorFunction<Arguments>,
): (container: HTMLElement, ...args: Arguments) => HTMLElement[] {
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
// Arguments is a tuple of unknown params
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeFindQuery<Arguments extends [...any, {}?]>(
  getter: (
    container: HTMLElement,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: Arguments
  ) => HTMLElement[] | HTMLElement | undefined,
) {
  return (
    container: HTMLElement,
    text: Arguments[0],
    options: Arguments[1],
    waitForOptions?: WaitForOptions,
  ) => {
    return waitFor(
      () => {
        // Technically, this function receives a very general `getter` argument, whose signature
        // may not match its usage in the next statement
        // We could define getter more narrowly to accept the `text` and `options` params, but
        // then that breaks this function's calls inside buildQueries,
        // which pass functions with the general signatures alluded to above
        // eslint-disable-next-line no-warning-comments
        // FIXME: clarification from maintainers would be appreciated here
        // @ts-expect-error explanation above
        return getter(container, text, options)
      },
      {container, ...waitForOptions},
    )
  }
}

const wrapSingleQueryWithSuggestion =
  <Arguments extends [...any, {}?]>( // eslint-disable-line @typescript-eslint/no-explicit-any
    query: {
      (container: HTMLElement, ...args: Arguments): HTMLElement
    },
    queryAllByName: string,
    variant: Variant | undefined,
  ): ((container: HTMLElement, ...args: Arguments) => HTMLElement) =>
  (container: HTMLElement, ...args: Arguments) => {
    const element = query(container, ...args)
    const [{suggest = getConfig().throwSuggestions} = {} as WithSuggest] =
      args.slice(-1) as [WithSuggest]
    if ((element as HTMLElement | undefined) && suggest) {
      // eslint-disable-next-line no-warning-comments
      // FIXME: When `src/suggestions.js` is converted to TS, remove this explicit type annotation, and the surrounding two eslint disable-lines
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const suggestion = getSuggestedQuery(element, variant) as
        | Suggestion
        | undefined
      if (suggestion && !queryAllByName.endsWith(suggestion.queryName)) {
        throw getSuggestionError(suggestion.toString(), container)
      }
    }

    return element
  }

const wrapAllByQueryWithSuggestion =
  <Arguments extends [...any, {}?]>( // eslint-disable-line @typescript-eslint/no-explicit-any
    query: {
      (container: HTMLElement, ...args: Arguments): HTMLElement[]
    },
    queryAllByName: string,
    variant: Variant | undefined,
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
        ...Array.from(
          new Set(
            els.map(element => getSuggestedQuery(element, variant)?.toString()),
          ),
        ),
      ]

      if (
        // only want to suggest if all the els have the same suggestion.
        uniqueSuggestionMessages.length === 1 &&
        // Is this actually nullish-safe? endsWith takes a string, but getSuggestedQuery() might return undefined
        // So .queryName must be accessed via optional chain, and so itself might be undefined
        // Is there a fallback that won't break the existing logic? Or can we be sure that it won't be undefined?
        // eslint-disable-next-line no-warning-comments
        // FIXME: clarification from maintainers would be appreciated here
        !queryAllByName.endsWith(
          // @ts-expect-error explanation/question above
          // eslint-disable-next-line no-warning-comments
          // FIXME: remove this type assertion + eslint-disable once `src/suggestions.js` is converted to TS
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          (getSuggestedQuery(els[0], variant) as Suggestion | undefined)
            ?.queryName,
        )
      ) {
        throw getSuggestionError(
          uniqueSuggestionMessages[0] as string,
          container,
        )
      }
    }

    return els
  }

// Arguments is a tuple of unknown params
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildQueries<Arguments extends [...any, {}?]>(
  queryAllBy: GetAllBy<Arguments>,
  getMultipleError: GetErrorFunction,
  getMissingError: GetErrorFunction,
): BuiltQueryMethods<Arguments> {
  const queryBy: QueryBy<Arguments> = wrapSingleQueryWithSuggestion(
    makeSingleQuery(
      queryAllBy,
      getMultipleError as unknown as GetErrorFunction<Arguments>,
    ),
    queryAllBy.name,
    'query',
  )
  const getAllBy: GetAllBy<Arguments> = makeGetAllQuery(
    queryAllBy,
    getMissingError as unknown as GetErrorFunction<Arguments>,
  )

  const getBy: GetBy<Arguments> = makeSingleQuery(
    getAllBy,
    getMultipleError as unknown as GetErrorFunction<Arguments>,
  )
  const getByWithSuggestions: GetBy<Arguments> = wrapSingleQueryWithSuggestion(
    getBy,
    queryAllBy.name,
    'get',
  )
  const getAllWithSuggestions: GetAllBy<Arguments> =
    wrapAllByQueryWithSuggestion(
      getAllBy,
      queryAllBy.name.replace('query', 'get'),
      'getAll',
    )

  const findAllBy: FindAllBy<Arguments> = makeFindQuery(
    wrapAllByQueryWithSuggestion(getAllBy, queryAllBy.name, 'findAll'),
  )
  const findBy: FindBy<Arguments> = makeFindQuery(
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

import {getConfig} from '../config'
import {checkContainerType} from '../helpers'
import {getLabels, getRealLabels, getLabelContent} from '../label-helpers'
import {
  AllByText,
  GetErrorFunction,
  Matcher,
  MatcherOptions,
  SelectorMatcherOptions,
} from '../../types'
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

function queryAllLabels(
  container: HTMLElement,
): {textToMatch: string | null; node: HTMLElement}[] {
  return Array.from(container.querySelectorAll<HTMLElement>('label,input'))
    .map(node => {
      return {node, textToMatch: getLabelContent(node)}
    })
    .filter(({textToMatch}) => textToMatch !== null)
}

const queryAllLabelsByText: AllByText = (
  container,
  text,
  {exact = true, trim, collapseWhitespace, normalizer} = {},
) => {
  const matcher = exact ? matches : fuzzyMatches
  const matchNormalizer = makeNormalizer({collapseWhitespace, trim, normalizer})

  const textToMatchByLabels = queryAllLabels(container)

  return textToMatchByLabels
    .filter(({node, textToMatch}) =>
      matcher(textToMatch, node, text, matchNormalizer),
    )
    .map(({node}) => node)
}

const queryAllByLabelText: AllByText = (
  container,
  text,
  {selector = '*', exact = true, collapseWhitespace, trim, normalizer} = {},
) => {
  checkContainerType(container)

  const matcher = exact ? matches : fuzzyMatches
  const matchNormalizer = makeNormalizer({collapseWhitespace, trim, normalizer})
  const matchingLabelledElements = Array.from(
    container.querySelectorAll<HTMLElement>('*'),
  )
    .filter(element => {
      return (
        getRealLabels(element).length || element.hasAttribute('aria-labelledby')
      )
    })
    .reduce<HTMLElement[]>((labelledElements, labelledElement) => {
      const labelList = getLabels(container, labelledElement, {selector})
      labelList
        .filter(label => Boolean(label.formControl))
        .forEach(label => {
          if (
            matcher(label.content, label.formControl, text, matchNormalizer) &&
            label.formControl
          ) {
            labelledElements.push(label.formControl)
          }
        })
      const labelsValue = labelList
        .filter(label => Boolean(label.content))
        .map(label => label.content)
      if (
        matcher(labelsValue.join(' '), labelledElement, text, matchNormalizer)
      ) {
        labelledElements.push(labelledElement)
      }
      if (labelsValue.length > 1) {
        labelsValue.forEach((labelValue, index) => {
          if (matcher(labelValue, labelledElement, text, matchNormalizer)) {
            labelledElements.push(labelledElement)
          }

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
            ) {
              labelledElements.push(labelledElement)
            }
          }
        })
      }

      return labelledElements
    }, [])
    .concat(
      queryAllByAttribute('aria-label', container, text, {
        exact,
        normalizer: matchNormalizer,
      }),
    )

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
const getAllByLabelText: AllByText = (container, text, ...rest) => {
  const els = queryAllByLabelText(container, text, ...rest)
  if (!els.length) {
    const labels = queryAllLabelsByText(container, text, ...rest)
    if (labels.length) {
      const tagNames = labels
        .map(label =>
          getTagNameOfElementAssociatedWithLabelViaFor(container, label),
        )
        .filter(tagName => !!tagName)
      if (tagNames.length) {
        throw getConfig().getElementError(
          tagNames
            .map(
              tagName =>
                `Found a label with the text of: ${text}, however the element associated with this label (<${tagName} />) is non-labellable [https://html.spec.whatwg.org/multipage/forms.html#category-label]. If you really need to label a <${tagName} />, you can use aria-label or aria-labelledby instead.`,
            )
            .join('\n\n'),
          container,
        )
      } else {
        throw getConfig().getElementError(
          `Found a label with the text of: ${text}, however no form control was found associated to that label. Make sure you're using the "for" attribute or "aria-labelledby" attribute correctly.`,
          container,
        )
      }
    } else {
      throw getConfig().getElementError(
        `Unable to find a label with the text of: ${text}`,
        container,
      )
    }
  }
  return els
}

function getTagNameOfElementAssociatedWithLabelViaFor(
  container: Element,
  label: Element,
): string | null {
  const htmlFor = label.getAttribute('for')
  if (!htmlFor) {
    return null
  }

  const element = container.querySelector(`[id="${htmlFor}"]`)
  return element ? element.tagName.toLowerCase() : null
}

// the reason mentioned above is the same reason we're not using buildQueries
const getMultipleError: GetErrorFunction<[unknown]> = (c, text) =>
  `Found multiple elements with the text of: ${text}`
const queryByLabelText = wrapSingleQueryWithSuggestion<
  // @ts-expect-error -- See `wrapAllByQueryWithSuggestion` Argument constraint comment
  [labelText: Matcher, options?: SelectorMatcherOptions]
>(
  makeSingleQuery(queryAllByLabelText, getMultipleError),
  queryAllByLabelText.name,
  'query',
)
const getByLabelText = makeSingleQuery(getAllByLabelText, getMultipleError)

const findAllByLabelText = makeFindQuery(
  wrapAllByQueryWithSuggestion<
    // @ts-expect-error -- See `wrapAllByQueryWithSuggestion` Argument constraint comment
    [labelText: Matcher, options?: SelectorMatcherOptions]
  >(getAllByLabelText, getAllByLabelText.name, 'findAll'),
)
const findByLabelText = makeFindQuery(
  wrapSingleQueryWithSuggestion<
    // @ts-expect-error -- See `wrapAllByQueryWithSuggestion` Argument constraint comment
    [labelText: Matcher, options?: SelectorMatcherOptions]
  >(getByLabelText, getAllByLabelText.name, 'find'),
)

const getAllByLabelTextWithSuggestions = wrapAllByQueryWithSuggestion<
  // @ts-expect-error -- See `wrapAllByQueryWithSuggestion` Argument constraint comment
  [labelText: Matcher, options?: MatcherOptions]
>(getAllByLabelText, getAllByLabelText.name, 'getAll')
const getByLabelTextWithSuggestions = wrapSingleQueryWithSuggestion<
  // @ts-expect-error -- See `wrapAllByQueryWithSuggestion` Argument constraint comment
  [labelText: Matcher, options?: SelectorMatcherOptions]
>(getByLabelText, getAllByLabelText.name, 'get')

const queryAllByLabelTextWithSuggestions = wrapAllByQueryWithSuggestion<
  // @ts-expect-error -- See `wrapAllByQueryWithSuggestion` Argument constraint comment
  [labelText: Matcher, options?: SelectorMatcherOptions]
>(queryAllByLabelText, queryAllByLabelText.name, 'queryAll')

export {
  queryAllByLabelTextWithSuggestions as queryAllByLabelText,
  queryByLabelText,
  getAllByLabelTextWithSuggestions as getAllByLabelText,
  getByLabelTextWithSuggestions as getByLabelText,
  findAllByLabelText,
  findByLabelText,
}

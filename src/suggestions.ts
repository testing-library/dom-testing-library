import {computeAccessibleName} from 'dom-accessibility-api'
import {Method, Variant} from '../types/suggestions'
import {getDefaultNormalizer} from './matches'
import {getNodeText} from './get-node-text'
import {DEFAULT_IGNORE_TAGS, getConfig} from './config'
import {getImplicitAriaRoles, isInaccessible} from './role-helpers'
import {getLabels} from './label-helpers'

type SuggestionOptions = {
  variant: Variant
  name?: string
}

type QueryOptions = {
  name?: RegExp
  hidden?: boolean
}

function isInput(element: Element): element is HTMLInputElement {
  return (element as Element & {value: unknown}).value !== undefined
}

type QueryArgs = [string | RegExp, QueryOptions?]

const normalize = getDefaultNormalizer()

function escapeRegExp(text: string) {
  return text.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

function getRegExpMatcher(text: string) {
  return new RegExp(escapeRegExp(text.toLowerCase()), 'i')
}

function makeSuggestion(
  queryName: string,
  element: Element,
  content: string,
  {variant, name}: SuggestionOptions,
) {
  let warning = ''
  const queryOptions: QueryOptions = {}
  const queryArgs: QueryArgs = [
    ['Role', 'TestId'].includes(queryName)
      ? content
      : getRegExpMatcher(content),
  ]

  if (name) {
    queryOptions.name = getRegExpMatcher(name)
  }

  if (queryName === 'Role' && isInaccessible(element)) {
    queryOptions.hidden = true
    warning = `Element is inaccessible. This means that the element and all its children are invisible to screen readers.
    If you are using the aria-hidden prop, make sure this is the right choice for your case.
    `
  }
  if (Object.keys(queryOptions).length > 0) {
    queryArgs.push(queryOptions)
  }

  const queryMethod = `${variant}By${queryName}`

  return {
    queryName,
    queryMethod,
    queryArgs,
    variant,
    warning,
    toString() {
      if (warning) {
        console.warn(warning)
      }
      const [text, options] = queryArgs

      const normalizedText = typeof text === 'string' ? `'${text}'` : text

      const stringifiedOptions = options
        ? `, { ${Object.entries(options)
            .map(([k, v]) => {
              return v === undefined ? '' : `${k}: ${v.toString()}`
            })
            .join(', ')} }`
        : ''

      return `${queryMethod}(${normalizedText.toString()}${stringifiedOptions})`
    },
  }
}

function canSuggest(
  currentMethod: string,
  requestedMethod: string | undefined,
  data: string | null,
) {
  return (
    data &&
    (!requestedMethod ||
      requestedMethod.toLowerCase() === currentMethod.toLowerCase())
  )
}

export function getSuggestedQuery(
  element: Element,
  variant: Variant = 'get',
  method?: Method,
) {
  // don't create suggestions for script and style elements
  if (element.matches(DEFAULT_IGNORE_TAGS)) {
    return undefined
  }

  //We prefer to suggest something else if the role is generic
  const role: string =
    element.getAttribute('role') ??
    (getImplicitAriaRoles(element) as string[])[0]
  if (role !== 'generic' && canSuggest('Role', method, role)) {
    return makeSuggestion('Role', element, role, {
      variant,
      name: computeAccessibleName(element, {
        computedStyleSupportsPseudoElements: getConfig()
          .computedStyleSupportsPseudoElements,
      }),
    })
  }

  const labelText = getLabels(document, element)
    .map(label => label.content)
    .join(' ')
  if (canSuggest('LabelText', method, labelText)) {
    return makeSuggestion('LabelText', element, labelText, {variant})
  }

  const placeholderText = element.getAttribute('placeholder')
  if (canSuggest('PlaceholderText', method, placeholderText)) {
    return makeSuggestion(
      'PlaceholderText',
      element,
      placeholderText as string,
      {
        variant,
      },
    )
  }

  const textContent = normalize(getNodeText(element))
  if (canSuggest('Text', method, textContent)) {
    return makeSuggestion('Text', element, textContent, {variant})
  }

  if (isInput(element) && canSuggest('DisplayValue', method, element.value)) {
    return makeSuggestion('DisplayValue', element, normalize(element.value), {
      variant,
    })
  }

  const alt = element.getAttribute('alt')
  if (canSuggest('AltText', method, alt)) {
    return makeSuggestion('AltText', element, alt as string, {variant})
  }

  const title = element.getAttribute('title')
  if (canSuggest('Title', method, title)) {
    return makeSuggestion('Title', element, title as string, {variant})
  }

  const testId = element.getAttribute(getConfig().testIdAttribute)
  if (canSuggest('TestId', method, testId)) {
    return makeSuggestion('TestId', element, testId as string, {variant})
  }

  return undefined
}

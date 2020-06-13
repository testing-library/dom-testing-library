import {computeAccessibleName} from 'dom-accessibility-api'
import {getDefaultNormalizer} from './matches'
import {getNodeText} from './get-node-text'
import {DEFAULT_IGNORE_TAGS} from './config'
import {getImplicitAriaRoles} from './role-helpers'

const normalize = getDefaultNormalizer()

function getLabelTextFor(element) {
  let label =
    element.labels &&
    Array.from(element.labels).find(el => Boolean(normalize(el.textContent)))

  // non form elements that are using aria-labelledby won't be included in `element.labels`
  if (!label) {
    const ariaLabelledBy = element.getAttribute('aria-labelledby')
    if (ariaLabelledBy) {
      // we're using this notation because with the # selector we would have to escape special characters e.g. user.name
      // see https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector#Escaping_special_characters
      label = document.querySelector(`[id=${ariaLabelledBy}]`)
    }
  }

  if (label) {
    return label.textContent
  }
  return undefined
}
function escapeRegExp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

function getRegExpMatcher(string) {
  return new RegExp(string.toLowerCase(), 'i')
}

function makeSuggestion(queryName, content, {variant = 'get', name}) {
  const queryArgs = [
    queryName === 'Role' || queryName === 'TestId'
      ? content
      : getRegExpMatcher(content),
  ]

  if (name) {
    queryArgs.push({name: new RegExp(escapeRegExp(name.toLowerCase()), 'i')})
  }

  const queryMethod = `${variant}By${queryName}`

  return {
    queryName,
    queryMethod,
    queryArgs,
    variant,
    toString() {
      let [text, options] = queryArgs

      text = typeof text === 'string' ? `'${text}'` : text

      options = options
        ? `, { ${Object.entries(options)
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ')} }`
        : ''

      return `${queryMethod}(${text}${options})`
    },
  }
}

function canSuggest(currentMethod, requestedMethod, data) {
  return (
    data &&
    (!requestedMethod ||
      requestedMethod.toLowerCase() === currentMethod.toLowerCase())
  )
}

export function getSuggestedQuery(element, variant, method) {
  // don't create suggestions for script and style elements
  if (element.matches(DEFAULT_IGNORE_TAGS)) {
    return undefined
  }

  const role =
    element.getAttribute('role') ?? getImplicitAriaRoles(element)?.[0]
  if (canSuggest('Role', method, role)) {
    return makeSuggestion('Role', role, {
      variant,
      name: computeAccessibleName(element),
    })
  }

  const labelText = getLabelTextFor(element)
  if (canSuggest('LabelText', method, labelText)) {
    return makeSuggestion('LabelText', labelText, {variant})
  }

  const placeholderText = element.getAttribute('placeholder')
  if (canSuggest('PlaceholderText', method, placeholderText)) {
    return makeSuggestion('PlaceholderText', placeholderText, {variant})
  }

  const textContent = normalize(getNodeText(element))
  if (canSuggest('Text', method, textContent)) {
    return makeSuggestion('Text', textContent, {variant})
  }

  if (canSuggest('DisplayValue', method, element.value)) {
    return makeSuggestion('DisplayValue', normalize(element.value), {variant})
  }

  const alt = element.getAttribute('alt')
  if (canSuggest('AltText', method, alt)) {
    return makeSuggestion('AltText', alt, {variant})
  }

  const title = element.getAttribute('title')
  if (canSuggest('Title', method, title)) {
    return makeSuggestion('Title', title, {variant})
  }

  const testId = element.getAttribute('data-testid')
  if (canSuggest('TestId', method, testId)) {
    return makeSuggestion('TestId', testId, {variant})
  }

  return undefined
}

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
function makeSuggestion(queryName, content, {variant, name}) {
  return {
    queryName,
    toString() {
      const options = name
        ? `, {name: /${escapeRegExp(name.toLowerCase())}/i}`
        : ''
      return `${variant}By${queryName}("${content}"${options})`
    },
  }
}

export function getSuggestedQuery(element, variant) {
  const role =
    element.getAttribute('role') ?? getImplicitAriaRoles(element)?.[0]
  if (role) {
    return makeSuggestion('Role', role, {
      variant,
      name: computeAccessibleName(element),
    })
  }

  const labelText = getLabelTextFor(element)
  if (labelText) {
    return makeSuggestion('LabelText', labelText, {variant})
  }

  const placeholderText = element.getAttribute('placeholder')
  if (placeholderText) {
    return makeSuggestion('PlaceholderText', placeholderText, {variant})
  }

  const textContent = normalize(getNodeText(element))
  if (textContent && !element.matches(DEFAULT_IGNORE_TAGS)) {
    return makeSuggestion('Text', textContent, {variant})
  }

  if (element.value) {
    return makeSuggestion('DisplayValue', normalize(element.value), {variant})
  }

  const alt = element.getAttribute('alt')
  if (alt) {
    return makeSuggestion('AltText', alt, {variant})
  }

  const title = element.getAttribute('title')

  if (title) {
    return makeSuggestion('Title', title, {variant})
  }

  return undefined
}

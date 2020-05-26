import {getRoles} from './role-helpers'
import {getDefaultNormalizer} from './queries/all-utils'
import {computeAccessibleName} from 'dom-accessibility-api'

const normalize = getDefaultNormalizer()

function getLabelTextFor(element) {
  let label

  const allLabels = Array.from(document.querySelectorAll('label'))

  label = allLabels.find(lbl => lbl.control === element)

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

function makeSuggestion(queryName, content, name) {
  return {
    queryName,
    content,
    toString() {
      const options = name ? `, {name:/${name}/}` : ''
      return `${queryName}("${content}"${options})`
    },
  }
}

// eslint-disable-next-line consistent-return
export function getSuggestedQuery(element) {
  const roles = getRoles(element)

  const roleNames = Object.keys(roles)
  const name = computeAccessibleName(element)
  if (roleNames.length) {
    const [role] = roleNames
    return makeSuggestion('Role', role, name)
  }

  const labelText = getLabelTextFor(element)
  if (labelText) {
    return makeSuggestion('LabelText', labelText)
  }

  const placeholderText = element.getAttribute('placeholder')
  if (placeholderText) {
    return makeSuggestion('PlaceholderText', placeholderText)
  }

  let {textContent} = element
  textContent = normalize(textContent)
  if (textContent) {
    return makeSuggestion('Text', textContent)
  }

  if (element.value) {
    return makeSuggestion('DisplayValue', normalize(element.value))
  }

  const alt = element.getAttribute('alt')
  if (alt) {
    return makeSuggestion('AltText', alt)
  }

  const title = element.getAttribute('title')

  if (title) {
    return makeSuggestion('Title', title)
  }
}

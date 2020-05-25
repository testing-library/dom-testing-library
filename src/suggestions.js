/* eslint-disable babel/new-cap */
import {getRoles} from './role-helpers'
const FORM_ELEMENTS = [
  'button',
  'input',
  'meter',
  'output',
  'progress',
  'select',
  'textarea',
]

function getSerializer(queryName, primaryMatch, secondaryMatch) {
  return () => {
    const options = secondaryMatch ? `, {name:/${secondaryMatch}/}` : ''
    return `${queryName}("${primaryMatch}"${options})`
  }
}

// eslint-disable-next-line consistent-return
export function getSuggestedQuery({element}) {
  const roles = getRoles(element)

  let queryName
  const roleNames = Object.keys(roles)
  let {textContent} = element
  if (roleNames.length) {
    queryName = 'Role'
    const [role] = roleNames

    return {
      queryName,
      role,
      textContent,
      toString: getSerializer(queryName, role, textContent),
    }
  }

  if (FORM_ELEMENTS.includes(element.tagName.toLowerCase())) {
    if (element.hasAttribute('id')) {
      const label = document.querySelector(
        `label[for="${element.getAttribute('id')}"]`,
      )
      ;({textContent} = label)

      queryName = 'LabelText'
      return {
        queryName,
        textContent,
        toString: getSerializer(queryName, textContent),
      }
    }

    const allLabels = Array.from(document.querySelectorAll('label'))

    const labelWithControl = allLabels.find(label => label.control === element)

    if (labelWithControl) {
      ;({textContent} = labelWithControl)

      queryName = 'LabelText'
      return {
        queryName,
        textContent,
        toString: getSerializer(queryName, textContent),
      }
    }

    const placeholderText = element.getAttribute('placeholder')
    if (placeholderText) {
      textContent = placeholderText
      queryName = 'PlaceholderText'
      return {
        queryName,
        textContent,
        toString: getSerializer(queryName, textContent),
      }
    }
  }

  if (textContent) {
    queryName = 'Text'
    return {
      queryName,
      textContent,
      toString: getSerializer(queryName, textContent),
    }
  }
}

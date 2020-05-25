import {getRoles} from './role-helpers'

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

function getSerializer(queryName, primaryMatch, secondaryMatch) {
  return () => {
    const options = secondaryMatch ? `, {name:/${secondaryMatch}/}` : ''
    return `${queryName}("${primaryMatch}"${options})`
  }
}

// eslint-disable-next-line consistent-return
export function getSuggestedQuery(element) {
  const roles = getRoles(element)

  let queryName
  const roleNames = Object.keys(roles)
  let {textContent} = element
  if (roleNames.length) {
    queryName = 'Role'
    const [role] = roleNames
    if (!textContent) {
      textContent = getLabelTextFor(element)
    }
    return {
      queryName,
      role,
      textContent,
      toString: getSerializer(queryName, role, textContent),
    }
  }

  textContent = getLabelTextFor(element)
  if (textContent) {
    queryName = 'LabelText'
    return {
      queryName,
      textContent,
      toString: getSerializer(queryName, textContent),
    }
  }

  // const allLabels = Array.from(document.querySelectorAll('label'))

  // const labelWithControl = allLabels.find(label => label.control === element)

  // if (labelWithControl) {
  //   ; ({ textContent } = labelWithControl)

  //   queryName = 'LabelText'
  //   return {
  //     queryName,
  //     textContent,
  //     toString: getSerializer(queryName, textContent),
  //   }
  // }

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

  ;({textContent} = element)
  if (textContent) {
    queryName = 'Text'
    return {
      queryName,
      textContent,
      toString: getSerializer(queryName, textContent),
    }
  }
}

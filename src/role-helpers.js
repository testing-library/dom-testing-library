import {elementRoles} from 'aria-query'
import merge from 'lodash.merge'
import {debugDOM} from './query-helpers'

function buildElementRoleList(elementRolesMap) {
  function makeElementSelector({name, attributes = []}) {
    return `${name}${attributes
      .map(({name: attributeName, value}) => `[${attributeName}=${value}]`)
      .join('')}`
  }

  function getSelectorSpecificity({attributes = []}) {
    return attributes.length
  }

  function bySelectorSpecificity(
    {specificity: leftSpecificity},
    {specificity: rightSpecificity},
  ) {
    return rightSpecificity - leftSpecificity
  }

  let result = []

  for (const [element, roles] of elementRolesMap.entries()) {
    result = [
      ...result,
      {
        selector: makeElementSelector(element),
        roles: Array.from(roles),
        specificity: getSelectorSpecificity(element),
      },
    ]
  }

  return result.sort(bySelectorSpecificity)
}

const elementRoleList = buildElementRoleList(elementRoles)
const elementRoleMap = elementRoleList.reduce(
  (acc, {selector, roles}) => ({...acc, [selector]: roles}),
  {},
)

function getRoles(container) {
  function getRolesForElements(elements) {
    return elements
      .filter(el => el.tagName !== undefined)
      .map(el => [el, elementRoleMap[el.tagName.toLowerCase()]])
      .reduce(
        (acc, [el, roleName]) =>
          acc[roleName]
            ? {...acc, [roleName]: [...acc[roleName], el]}
            : {...acc, [roleName]: [el]},
        {},
      )
  }

  const elements = Array.isArray(container) ? container : [container]
  const childRoles = elements.reduce(
    (acc, el) => ({...acc, ...getRoles(Array.from(el.childNodes))}),
    {},
  )

  return merge(getRolesForElements(elements), childRoles)
}

function logRoles(container) {
  const roles = getRoles(container)

  return Object.entries(roles)
    .map(
      ([role, elements]) =>
        `${role}:\n${elements.map(el => debugDOM(el)).join('\n')}\n\n`,
    )
    .join('')
}

export {
  getRoles,
  logRoles,
  buildElementRoleList,
  elementRoleList,
  elementRoleMap,
}

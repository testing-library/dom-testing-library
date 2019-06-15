import {elementRoles} from 'aria-query'
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
  function flattenDOM(node) {
    return [
      node,
      ...Array.from(node.children).reduce(
        (acc, c) => (c.tagName ? [...acc, ...flattenDOM(c)] : acc),
        [],
      ),
    ]
  }

  return flattenDOM(container).reduce((acc, node) => {
    const role = elementRoleMap[node.tagName.toLowerCase()]
    return Array.isArray(acc[role])
      ? {...acc, [role]: [...acc[role], node]}
      : {...acc, [role]: [node]}
  }, [])
}

function logRoles(container) {
  const roles = getRoles(container)

  return Object.entries(roles)
    .map(([role, elements]) => {
      const numDelimeters = 42 - role.length - 1 // 42 is arbitrary
      const delimeterBar = [...Array(numDelimeters)].map(_ => '#').join('')
      const elementsString = elements
        .map(el => `${debugDOM(el.cloneNode(false))}`)
        .join('\n\n')

      return `${role} ${delimeterBar}\n\n${elementsString}\n\n\n`
    })
    .join('')
}

export {
  getRoles,
  logRoles,
  buildElementRoleList,
  elementRoleList,
  elementRoleMap,
}

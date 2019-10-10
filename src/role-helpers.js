import {elementRoles} from 'aria-query'
import {prettyDOM} from './pretty-dom'

const elementRoleList = buildElementRoleList(elementRoles)

/**
 * Partial implementation https://www.w3.org/TR/wai-aria-1.2/#tree_exclusion
 * which should only be used for elements with a non-presentational role i.e.
 * `role="none"` and `role="presentation"` will not be excluded.
 *
 * Implements aria-hidden semantics (i.e. parent overrides child)
 * Ignores "Child Presentational: True" characteristics
 *
 * @param {Element} element -
 * @returns {boolean} true if excluded, otherwise false
 */
function shouldExcludeFromA11yTree(element) {
  const window = element.ownerDocument.defaultView
  const computedStyle = window.getComputedStyle(element)
  // since visibility is inherited we can exit early
  if (computedStyle.visibility === 'hidden') {
    return true
  }

  // Remove once https://github.com/jsdom/jsdom/issues/2616 is fixed
  const supportsStyleInheritance = computedStyle.visibility !== ''
  let visibility = computedStyle.visibility

  let currentElement = element
  while (currentElement) {
    if (currentElement.hidden === true) {
      return true
    }

    if (currentElement.getAttribute('aria-hidden') === 'true') {
      return true
    }

    const currentComputedStyle = window.getComputedStyle(currentElement)

    if (currentComputedStyle.display === 'none') {
      return true
    }

    if (supportsStyleInheritance === false) {
      // we go bottom-up for an inheritable property so we can only set it
      // if it wasn't set already i.e. the parent can't overwrite the child
      if (visibility === '') visibility = currentComputedStyle.visibility
      if (visibility === 'hidden') {
        return true
      }
    }

    currentElement = currentElement.parentElement
  }

  return false
}

function getImplicitAriaRoles(currentNode) {
  // eslint bug here:
  // eslint-disable-next-line no-unused-vars
  for (const {selector, roles} of elementRoleList) {
    if (currentNode.matches(selector)) {
      return [...roles]
    }
  }

  return []
}

function buildElementRoleList(elementRolesMap) {
  function makeElementSelector({name, attributes = []}) {
    return `${name}${attributes
      .map(({name: attributeName, value}) =>
        value ? `[${attributeName}=${value}]` : `[${attributeName}]`,
      )
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

  // eslint bug here:
  // eslint-disable-next-line no-unused-vars
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

function getRoles(container, {hidden = false} = {}) {
  function flattenDOM(node) {
    return [
      node,
      ...Array.from(node.children).reduce(
        (acc, child) => [...acc, ...flattenDOM(child)],
        [],
      ),
    ]
  }

  return flattenDOM(container)
    .filter(element => {
      return hidden === false
        ? shouldExcludeFromA11yTree(element) === false
        : true
    })
    .reduce((acc, node) => {
      const roles = getImplicitAriaRoles(node)

      return roles.reduce(
        (rolesAcc, role) =>
          Array.isArray(rolesAcc[role])
            ? {...rolesAcc, [role]: [...rolesAcc[role], node]}
            : {...rolesAcc, [role]: [node]},
        acc,
      )
    }, {})
}

function prettyRoles(dom, {hidden}) {
  const roles = getRoles(dom, {hidden})

  return Object.entries(roles)
    .map(([role, elements]) => {
      const delimiterBar = '-'.repeat(50)
      const elementsString = elements
        .map(el => prettyDOM(el.cloneNode(false)))
        .join('\n\n')

      return `${role}:\n\n${elementsString}\n\n${delimiterBar}`
    })
    .join('\n')
}

const logRoles = (dom, {hidden = false} = {}) =>
  console.log(prettyRoles(dom, {hidden}))

export {
  getRoles,
  logRoles,
  getImplicitAriaRoles,
  prettyRoles,
  shouldExcludeFromA11yTree,
}

/* eslint no-console:0 */

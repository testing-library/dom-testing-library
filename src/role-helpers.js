import {elementRoles} from 'aria-query'
import {prettyDOM} from './pretty-dom'

const elementRoleList = buildElementRoleList(elementRoles)

/**
 * @param {Element} element -
 * @returns {boolean} - `true` if `element` and its subtree are inaccessible
 */
function isSubtreeInaccessible(element) {
  if (element.hidden === true) {
    return true
  }

  if (element.getAttribute('aria-hidden') === 'true') {
    return true
  }

  const window = element.ownerDocument.defaultView
  if (window.getComputedStyle(element).display === 'none') {
    return true
  }

  return false
}

/**
 * Partial implementation https://www.w3.org/TR/wai-aria-1.2/#tree_exclusion
 * which should only be used for elements with a non-presentational role i.e.
 * `role="none"` and `role="presentation"` will not be excluded.
 *
 * Implements aria-hidden semantics (i.e. parent overrides child)
 * Ignores "Child Presentational: True" characteristics
 *
 * @param {Element} element -
 * @param {object} [options] -
 * @param {function (element: Element): boolean} options.isSubtreeInaccessible -
 * can be used to return cached results from previous isSubtreeInaccessible calls
 * @returns {boolean} true if excluded, otherwise false
 */
function isInaccessible(element, options = {}) {
  const {
    isSubtreeInaccessible: isSubtreeInaccessibleImpl = isSubtreeInaccessible,
  } = options
  const window = element.ownerDocument.defaultView
  // since visibility is inherited we can exit early
  if (window.getComputedStyle(element).visibility === 'hidden') {
    return true
  }

  let currentElement = element
  while (currentElement) {
    if (isSubtreeInaccessibleImpl(currentElement)) {
      return true
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
      return hidden === false ? isInaccessible(element) === false : true
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
  isSubtreeInaccessible,
  prettyRoles,
  isInaccessible,
}

/* eslint no-console:0 */

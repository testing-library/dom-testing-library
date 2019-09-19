import {getImplicitAriaRoles, prettyRoles} from '../role-helpers'
import {buildQueries, fuzzyMatches, makeNormalizer, matches} from './all-utils'

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
  const computedStyle = window.getComputedStyle(element)
  // since visibility is inherited we can exit early
  if (computedStyle.visibility === 'hidden') {
    return true
  }

  // Remove once https://github.com/jsdom/jsdom/issues/2616 is fixed
  const supportsStyleInheritance = computedStyle.visibility !== ''
  let visibility = computedStyle.visibility

  let currentElement = element
  while (currentElement !== null) {
    if (currentElement.hasAttribute('hidden')) {
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

function queryAllByRole(
  container,
  role,
  {exact = true, collapseWhitespace, hidden = false, trim, normalizer} = {},
) {
  const matcher = exact ? matches : fuzzyMatches
  const matchNormalizer = makeNormalizer({collapseWhitespace, trim, normalizer})

  return Array.from(container.querySelectorAll('*'))
    .filter(element => {
      return hidden === false
        ? shouldExcludeFromA11yTree(element) === false
        : true
    })
    .filter(node => {
      const isRoleSpecifiedExplicitly = node.hasAttribute('role')

      if (isRoleSpecifiedExplicitly) {
        return matcher(node.getAttribute('role'), node, role, matchNormalizer)
      }

      const implicitRoles = getImplicitAriaRoles(node)

      return implicitRoles.some(implicitRole =>
        matcher(implicitRole, node, role, matchNormalizer),
      )
    })
}

const getMultipleError = (c, role) =>
  `Found multiple elements with the role "${role}"`

const getMissingError = (container, role) => {
  const roles = prettyRoles(container)
  let roleMessage

  if (roles.length === 0) {
    roleMessage = 'There are no available roles.'
  } else {
    roleMessage = `
Here are the available roles:

  ${roles.replace(/\n/g, '\n  ').replace(/\n\s\s\n/g, '\n\n')}
`.trim()
  }

  return `
Unable to find an element with the role "${role}"

${roleMessage}`.trim()
}

const [
  queryByRole,
  getAllByRole,
  getByRole,
  findAllByRole,
  findByRole,
] = buildQueries(queryAllByRole, getMultipleError, getMissingError)

export {
  queryByRole,
  queryAllByRole,
  getAllByRole,
  getByRole,
  findAllByRole,
  findByRole,
}

import {
  getImplicitAriaRoles,
  prettyRoles,
  isInaccessible,
  isSubtreeInaccessible,
} from '../role-helpers'
import {
  buildQueries,
  fuzzyMatches,
  getConfig,
  makeNormalizer,
  matches,
} from './all-utils'

function queryAllByRole(
  container,
  role,
  {
    exact = true,
    collapseWhitespace,
    hidden = getConfig().defaultHidden,
    trim,
    normalizer,
  } = {},
) {
  const matcher = exact ? matches : fuzzyMatches
  const matchNormalizer = makeNormalizer({collapseWhitespace, trim, normalizer})

  const subtreeIsInaccessibleCache = new WeakMap()
  function cachedIsSubtreeInaccessible(element) {
    if (!subtreeIsInaccessibleCache.has(element)) {
      subtreeIsInaccessibleCache.set(element, isSubtreeInaccessible(element))
    }

    return subtreeIsInaccessibleCache.get(element)
  }

  return Array.from(container.querySelectorAll('*'))
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
    .filter(element => {
      return hidden === false
        ? isInaccessible(element, {
            isSubtreeInaccessible: cachedIsSubtreeInaccessible,
          }) === false
        : true
    })
}

const getMultipleError = (c, role) =>
  `Found multiple elements with the role "${role}"`

const getMissingError = (
  container,
  role,
  {hidden = getConfig().defaultHidden} = {},
) => {
  const roles = prettyRoles(container, {hidden})
  let roleMessage

  if (roles.length === 0) {
    if (hidden === false) {
      roleMessage =
        'There are no accessible roles. But there might be some inaccessible roles. ' +
        'If you wish to access them, then set the `hidden` option to `true`. ' +
        'Learn more about this here: https://testing-library.com/docs/dom-testing-library/api-queries#byrole'
    } else {
      roleMessage = 'There are no available roles.'
    }
  } else {
    roleMessage = `
Here are the ${hidden === false ? 'accessible' : 'available'} roles:

  ${roles.replace(/\n/g, '\n  ').replace(/\n\s\s\n/g, '\n\n')}
`.trim()
  }

  return `
Unable to find an ${
    hidden === false ? 'accessible ' : ''
  }element with the role "${role}"

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

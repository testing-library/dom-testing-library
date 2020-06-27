import {computeAccessibleName} from 'dom-accessibility-api'
import {roles as allRoles} from 'aria-query'
import {
  computeAriaSelected,
  getImplicitAriaRoles,
  prettyRoles,
  isInaccessible,
  isSubtreeInaccessible,
  getRolesAndSuperClassByRoles,
} from '../role-helpers'
import {wrapAllByQueryWithSuggestion} from '../query-helpers'
import {checkContainerType} from '../helpers'
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
    name,
    trim,
    normalizer,
    queryFallbacks = false,
    selected,
  } = {},
) {
  checkContainerType(container)
  const matcher = exact ? matches : fuzzyMatches
  const matchNormalizer = makeNormalizer({collapseWhitespace, trim, normalizer})

  if (selected !== undefined) {
    // guard against unknown roles
    if (allRoles.get(role)?.props['aria-selected'] === undefined) {
      throw new Error(`"aria-selected" is not supported on role "${role}".`)
    }
  }

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
        const roleValue = node.getAttribute('role')
        if (queryFallbacks) {
          const roles = roleValue.split(' ').filter(Boolean)
          return getRolesAndSuperClassByRoles(roles).some(text =>
            matcher(text, node, role, matchNormalizer),
          )
        }
        // if a custom normalizer is passed then let normalizer handle the role value
        if (normalizer) {
          return getRolesAndSuperClassByRoles(roleValue).some(text =>
            matcher(text, node, role, matchNormalizer),
          )
        }
        // other wise only send the first word to match
        const roles = getRolesAndSuperClassByRoles(roleValue.split(' ')[0])
        return roles.some(text => matcher(text, node, role, matchNormalizer))
      }

      let implicitRoles = getImplicitAriaRoles(node)
      implicitRoles = getRolesAndSuperClassByRoles(implicitRoles)
      return implicitRoles.some(implicitRole =>
        matcher(implicitRole, node, role, matchNormalizer),
      )
    })
    .filter(element => {
      if (selected !== undefined) {
        return selected === computeAriaSelected(element)
      }
      // don't care if aria attributes are unspecified
      return true
    })
    .filter(element => {
      return hidden === false
        ? isInaccessible(element, {
            isSubtreeInaccessible: cachedIsSubtreeInaccessible,
          }) === false
        : true
    })
    .filter(element => {
      if (name === undefined) {
        // Don't care
        return true
      }

      return matches(
        computeAccessibleName(element),
        element,
        name,
        text => text,
      )
    })
}

const getMultipleError = (c, role) =>
  `Found multiple elements with the role "${role}"`

const getMissingError = (
  container,
  role,
  {hidden = getConfig().defaultHidden, name} = {},
) => {
  if (getConfig()._disableExpensiveErrorDiagnostics) {
    return `Unable to find role="${role}"`
  }

  let roles = ''
  Array.from(container.children).forEach(childElement => {
    roles += prettyRoles(childElement, {
      hidden,
      includeName: name !== undefined,
    })
  })
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

  let nameHint = ''
  if (name === undefined) {
    nameHint = ''
  } else if (typeof name === 'string') {
    nameHint = ` and name "${name}"`
  } else {
    nameHint = ` and name \`${name}\``
  }

  return `
Unable to find an ${
    hidden === false ? 'accessible ' : ''
  }element with the role "${role}"${nameHint}

${roleMessage}`.trim()
}
const queryAllByRoleWithSuggestions = wrapAllByQueryWithSuggestion(
  queryAllByRole,
  queryAllByRole.name,
  'queryAll',
)
const [
  queryByRole,
  getAllByRole,
  getByRole,
  findAllByRole,
  findByRole,
] = buildQueries(queryAllByRole, getMultipleError, getMissingError)

export {
  queryByRole,
  queryAllByRoleWithSuggestions as queryAllByRole,
  getAllByRole,
  getByRole,
  findAllByRole,
  findByRole,
}

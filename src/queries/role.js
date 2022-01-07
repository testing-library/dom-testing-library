import {computeAccessibleName} from 'dom-accessibility-api'
import {roles as allRoles, roleElements} from 'aria-query'
import {
  computeAriaSelected,
  computeAriaChecked,
  computeAriaPressed,
  computeAriaCurrent,
  computeAriaExpanded,
  computeHeadingLevel,
  getImplicitAriaRoles,
  prettyRoles,
  isInaccessible,
  isSubtreeInaccessible,
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
    checked,
    pressed,
    current,
    level,
    expanded,
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

  if (checked !== undefined) {
    // guard against unknown roles
    if (allRoles.get(role)?.props['aria-checked'] === undefined) {
      throw new Error(`"aria-checked" is not supported on role "${role}".`)
    }
  }

  if (pressed !== undefined) {
    // guard against unknown roles
    if (allRoles.get(role)?.props['aria-pressed'] === undefined) {
      throw new Error(`"aria-pressed" is not supported on role "${role}".`)
    }
  }

  if (current !== undefined) {
    /* istanbul ignore next */
    // guard against unknown roles
    // All currently released ARIA versions support `aria-current` on all roles.
    // Leaving this for symetry and forward compatibility
    if (allRoles.get(role)?.props['aria-current'] === undefined) {
      throw new Error(`"aria-current" is not supported on role "${role}".`)
    }
  }

  if (level !== undefined) {
    // guard against using `level` option with any role other than `heading`
    if (role !== 'heading') {
      throw new Error(`Role "${role}" cannot have "level" property.`)
    }
  }

  if (expanded !== undefined) {
    // guard against unknown roles
    if (allRoles.get(role)?.props['aria-expanded'] === undefined) {
      throw new Error(`"aria-expanded" is not supported on role "${role}".`)
    }
  }

  const subtreeIsInaccessibleCache = new WeakMap()
  function cachedIsSubtreeInaccessible(element) {
    if (!subtreeIsInaccessibleCache.has(element)) {
      subtreeIsInaccessibleCache.set(element, isSubtreeInaccessible(element))
    }

    return subtreeIsInaccessibleCache.get(element)
  }

  return Array.from(
    container.querySelectorAll(
      // Only query elements that can be matched by the following filters
      makeRoleSelector(role, exact, normalizer ? matchNormalizer : undefined),
    ),
  )
    .filter(node => {
      const isRoleSpecifiedExplicitly = node.hasAttribute('role')

      if (isRoleSpecifiedExplicitly) {
        const roleValue = node.getAttribute('role')
        if (queryFallbacks) {
          return roleValue
            .split(' ')
            .filter(Boolean)
            .some(text => matcher(text, node, role, matchNormalizer))
        }
        // if a custom normalizer is passed then let normalizer handle the role value
        if (normalizer) {
          return matcher(roleValue, node, role, matchNormalizer)
        }
        // other wise only send the first word to match
        const [firstWord] = roleValue.split(' ')
        return matcher(firstWord, node, role, matchNormalizer)
      }

      const implicitRoles = getImplicitAriaRoles(node)

      return implicitRoles.some(implicitRole =>
        matcher(implicitRole, node, role, matchNormalizer),
      )
    })
    .filter(element => {
      if (selected !== undefined) {
        return selected === computeAriaSelected(element)
      }
      if (checked !== undefined) {
        return checked === computeAriaChecked(element)
      }
      if (pressed !== undefined) {
        return pressed === computeAriaPressed(element)
      }
      if (current !== undefined) {
        return current === computeAriaCurrent(element)
      }
      if (expanded !== undefined) {
        return expanded === computeAriaExpanded(element)
      }
      if (level !== undefined) {
        return level === computeHeadingLevel(element)
      }
      // don't care if aria attributes are unspecified
      return true
    })
    .filter(element => {
      if (name === undefined) {
        // Don't care
        return true
      }

      return matches(
        computeAccessibleName(element, {
          computedStyleSupportsPseudoElements:
            getConfig().computedStyleSupportsPseudoElements,
        }),
        element,
        name,
        text => text,
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

function makeRoleSelector(role, exact, customNormalizer) {
  if (typeof role !== 'string') {
    // For non-string role parameters we can not determine the implicitRoleSelectors.
    return '*'
  }

  const explicitRoleSelector =
    exact && !customNormalizer ? `*[role~="${role}"]` : '*[role]'

  const roleRelations = roleElements.get(role) ?? new Set()
  const implicitRoleSelectors = new Set(
    Array.from(roleRelations).map(({name}) => name),
  )

  // Current transpilation config sometimes assumes `...` is always applied to arrays.
  // `...` is equivalent to `Array.prototype.concat` for arrays.
  // If you replace this code with `[explicitRoleSelector, ...implicitRoleSelectors]`, make sure every transpilation target retains the `...` in favor of `Array.prototype.concat`.
  return [explicitRoleSelector]
    .concat(Array.from(implicitRoleSelectors))
    .join(',')
}

const getMultipleError = (c, role, {name} = {}) => {
  let nameHint = ''
  if (name === undefined) {
    nameHint = ''
  } else if (typeof name === 'string') {
    nameHint = ` and name "${name}"`
  } else {
    nameHint = ` and name \`${name}\``
  }

  return `Found multiple elements with the role "${role}"${nameHint}`
}

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
const [queryByRole, getAllByRole, getByRole, findAllByRole, findByRole] =
  buildQueries(queryAllByRole, getMultipleError, getMissingError)

export {
  queryByRole,
  queryAllByRoleWithSuggestions as queryAllByRole,
  getAllByRole,
  getByRole,
  findAllByRole,
  findByRole,
}

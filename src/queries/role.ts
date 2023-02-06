import {
  computeAccessibleDescription,
  computeAccessibleName,
} from 'dom-accessibility-api'
import {
  roles as allRoles,
  roleElements,
  ARIARoleDefinitionKey,
} from 'aria-query'
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
  AllByRole,
  ByRoleMatcher,
  ByRoleOptions,
  GetErrorFunction,
  Matcher,
  MatcherFunction,
  MatcherOptions,
} from '../../types'

import {buildQueries, getConfig, matches} from './all-utils'

const queryAllByRole: AllByRole = (
  container,
  role,
  {
    hidden = getConfig().defaultHidden,
    name,
    description,
    queryFallbacks = false,
    selected,
    checked,
    pressed,
    current,
    level,
    expanded,
  } = {},
) => {
  checkContainerType(container)

  if (selected !== undefined) {
    // guard against unknown roles
    if (
      allRoles.get(role as ARIARoleDefinitionKey)?.props['aria-selected'] ===
      undefined
    ) {
      throw new Error(`"aria-selected" is not supported on role "${role}".`)
    }
  }

  if (checked !== undefined) {
    // guard against unknown roles
    if (
      allRoles.get(role as ARIARoleDefinitionKey)?.props['aria-checked'] ===
      undefined
    ) {
      throw new Error(`"aria-checked" is not supported on role "${role}".`)
    }
  }

  if (pressed !== undefined) {
    // guard against unknown roles
    if (
      allRoles.get(role as ARIARoleDefinitionKey)?.props['aria-pressed'] ===
      undefined
    ) {
      throw new Error(`"aria-pressed" is not supported on role "${role}".`)
    }
  }

  if (current !== undefined) {
    /* istanbul ignore next */
    // guard against unknown roles
    // All currently released ARIA versions support `aria-current` on all roles.
    // Leaving this for symetry and forward compatibility
    if (
      allRoles.get(role as ARIARoleDefinitionKey)?.props['aria-current'] ===
      undefined
    ) {
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
    if (
      allRoles.get(role as ARIARoleDefinitionKey)?.props['aria-expanded'] ===
      undefined
    ) {
      throw new Error(`"aria-expanded" is not supported on role "${role}".`)
    }
  }

  const subtreeIsInaccessibleCache = new WeakMap<Element, Boolean>()
  function cachedIsSubtreeInaccessible(element: Element) {
    if (!subtreeIsInaccessibleCache.has(element)) {
      subtreeIsInaccessibleCache.set(element, isSubtreeInaccessible(element))
    }

    return subtreeIsInaccessibleCache.get(element) as boolean
  }

  return Array.from(
    container.querySelectorAll<HTMLElement>(
      // Only query elements that can be matched by the following filters
      makeRoleSelector(role),
    ),
  )
    .filter(node => {
      const isRoleSpecifiedExplicitly = node.hasAttribute('role')

      if (isRoleSpecifiedExplicitly) {
        const roleValue = node.getAttribute('role') as string
        if (queryFallbacks) {
          return roleValue
            .split(' ')
            .filter(Boolean)
            .some(roleAttributeToken => roleAttributeToken === role)
        }
        // other wise only send the first token to match
        const [firstRoleAttributeToken] = roleValue.split(' ')
        return firstRoleAttributeToken === role
      }

      const implicitRoles = getImplicitAriaRoles(node) as string[]

      return implicitRoles.some(implicitRole => {
        return implicitRole === role
      })
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
        name as MatcherFunction,
        text => text,
      )
    })
    .filter(element => {
      if (description === undefined) {
        // Don't care
        return true
      }

      return matches(
        computeAccessibleDescription(element, {
          computedStyleSupportsPseudoElements:
            getConfig().computedStyleSupportsPseudoElements,
        }),
        element,
        description as Matcher,
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

function makeRoleSelector(role: ByRoleMatcher) {
  const explicitRoleSelector = `*[role~="${role}"]`

  const roleRelations =
    roleElements.get(role as ARIARoleDefinitionKey) ?? new Set()
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

const getNameHint = (name: ByRoleOptions['name']): string => {
  let nameHint = ''
  if (name === undefined) {
    nameHint = ''
  } else if (typeof name === 'string') {
    nameHint = ` and name "${name}"`
  } else {
    nameHint = ` and name \`${name}\``
  }

  return nameHint
}

const getMultipleError: GetErrorFunction<
  [matcher: ByRoleMatcher, options: ByRoleOptions]
> = (c, role, {name} = {}) => {
  return `Found multiple elements with the role "${role}"${getNameHint(name)}`
}

const getMissingError: GetErrorFunction<
  [matcher: ByRoleMatcher, options: ByRoleOptions]
> = (
  container,
  role,
  {hidden = getConfig().defaultHidden, name, description} = {},
) => {
  if (getConfig()._disableExpensiveErrorDiagnostics) {
    return `Unable to find role="${role}"${getNameHint(name)}`
  }

  let roles = ''
  Array.from((container as Element).children).forEach(childElement => {
    roles += prettyRoles(childElement, {
      hidden,
      includeDescription: description !== undefined,
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

  let descriptionHint = ''
  if (description === undefined) {
    descriptionHint = ''
  } else if (typeof description === 'string') {
    descriptionHint = ` and description "${description}"`
  } else {
    descriptionHint = ` and description \`${description}\``
  }

  return `
Unable to find an ${
    hidden === false ? 'accessible ' : ''
  }element with the role "${role}"${nameHint}${descriptionHint}

${roleMessage}`.trim()
}
const queryAllByRoleWithSuggestions = wrapAllByQueryWithSuggestion<
  // @ts-expect-error -- See `wrapAllByQueryWithSuggestion` Argument constraint comment
  [labelText: Matcher, options?: MatcherOptions]
>(queryAllByRole, queryAllByRole.name, 'queryAll')
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

import {computeAccessibleName} from 'dom-accessibility-api'
import {roles as allRoles} from 'aria-query'
import {
  computeAriaSelected,
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
  Matcher,
  MatcherOptions,
  matches,
} from './all-utils'

export interface ByRoleOptions extends MatcherOptions {
  /**
   * If true includes elements in the query set that are usually excluded from
   * the accessibility tree. `role="none"` or `role="presentation"` are included
   * in either case.
   */
  hidden?: boolean
  /**
   * If true only includes elements in the query set that are marked as
   * selected in the accessibility tree, i.e., `aria-selected="true"`
   */
  selected?: boolean
  /**
   * Includes every role used in the `role` attribute
   * For example *ByRole('progressbar', {queryFallbacks: true})` will find <div role="meter progressbar">`.
   */
  queryFallbacks?: boolean
  /**
   * Only considers  elements with the specified accessible name.
   */
  name?:
    | string
    | RegExp
    | ((accessibleName: string, element: Element) => boolean)
}

function queryAllByRole(
  container: HTMLElement,
  role: Matcher,
  {
    exact = true,
    collapseWhitespace,
    hidden = getConfig().defaultHidden,
    name,
    trim,
    normalizer,
    queryFallbacks = false,
    selected,
  }: ByRoleOptions = {},
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
    .filter((node: HTMLElement) => {
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
      // don't care if aria attributes are unspecified
      return true
    })
    .filter((element: HTMLElement) => {
      return hidden === false
        ? isInaccessible(element, {
            isSubtreeInaccessible: cachedIsSubtreeInaccessible,
          }) === false
        : true
    })
    .filter((element: HTMLElement) => {
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
    }) as HTMLElement[]
}

const getMultipleError = (c, role) =>
  `Found multiple elements with the role "${role}"`

const getMissingError = (
  container,
  role,
  {hidden = getConfig().defaultHidden, name}: ByRoleOptions = {},
) => {
  if (getConfig()._disableExpensiveErrorDiagnostics) {
    return `Unable to find role="${role}"`
  }

  let roles = ''
  Array.from(container.children).forEach((childElement: HTMLElement) => {
    roles += prettyRoles(childElement, {
      hidden,
      // @ts-ignore FIXME remove this code? prettyRoles does not seem handle 'includeName'
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

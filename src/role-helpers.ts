import {
  ARIARoleDefinitionKey,
  ARIARoleRelationConcept,
  elementRoles,
} from 'aria-query'
import {
  computeAccessibleDescription,
  computeAccessibleName,
} from 'dom-accessibility-api'
import {prettyDOM} from './pretty-dom'
import {getConfig} from './config'

type ElementRoles = typeof elementRoles

const elementRoleList = buildElementRoleList(elementRoles)

/**
 * @param {Element} element -
 * @returns {boolean} - `true` if `element` and its subtree are inaccessible
 */
type IsSubtreeInaccessible = typeof isSubtreeInaccessible
function isSubtreeInaccessible(element: Element) {
  if (element.getAttribute('hidden') !== null) {
    return true
  }

  if (element.getAttribute('aria-hidden') === 'true') {
    return true
  }

  const window = element.ownerDocument.defaultView!
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
type IsInaccessibleOptions = {isSubtreeInaccessible?: IsSubtreeInaccessible}
function isInaccessible(element: Element, options: IsInaccessibleOptions = {}) {
  const {
    isSubtreeInaccessible: isSubtreeInaccessibleImpl = isSubtreeInaccessible,
  } = options
  const window = element.ownerDocument.defaultView!
  // since visibility is inherited we can exit early
  if (window.getComputedStyle(element).visibility === 'hidden') {
    return true
  }

  let currentElement = element
  while (currentElement) {
    if (isSubtreeInaccessibleImpl(currentElement)) {
      return true
    }

    currentElement = currentElement.parentElement!
  }

  return false
}

function getImplicitAriaRoles(currentNode: Element) {
  // eslint bug here:
  // eslint-disable-next-line no-unused-vars
  for (const {match, roles} of elementRoleList) {
    if (match(currentNode)) {
      return [...roles]
    }
  }

  return []
}
interface RoleList {
  match: any
  roles: ARIARoleDefinitionKey[]
  specificity: number
}
function buildElementRoleList(elementRolesMap: ElementRoles) {
  function makeElementSelector({name, attributes}: ARIARoleRelationConcept) {
    return `${name}${attributes!
      .map(({name: attributeName, value, constraints = []}) => {
        const shouldNotExist = constraints.indexOf('undefined' as any) !== -1
        if (shouldNotExist) {
          return `:not([${attributeName}])`
        } else if (value) {
          return `[${attributeName}="${value}"]`
        } else {
          return `[${attributeName}]`
        }
      })
      .join('')}`
  }

  function getSelectorSpecificity({attributes = []}: ARIARoleRelationConcept) {
    return attributes.length
  }

  function bySelectorSpecificity(
    {specificity: leftSpecificity}: RoleList,
    {specificity: rightSpecificity}: RoleList,
  ) {
    return rightSpecificity - leftSpecificity
  }

  function match(element: ARIARoleRelationConcept) {
    let {attributes = []} = element

    // https://github.com/testing-library/dom-testing-library/issues/814
    const typeTextIndex = attributes.findIndex(
      attribute =>
        attribute.value &&
        attribute.name === 'type' &&
        attribute.value === 'text',
    )

    if (typeTextIndex >= 0) {
      // not using splice to not mutate the attributes array
      attributes = [
        ...attributes.slice(0, typeTextIndex),
        ...attributes.slice(typeTextIndex + 1),
      ]
    }

    const selector = makeElementSelector({...element, attributes})

    return (node: Element) => {
      if (typeTextIndex >= 0 && (node as HTMLInputElement).type !== 'text') {
        return false
      }

      return node.matches(selector)
    }
  }

  let result: RoleList[] = []

  // eslint bug here:
  // eslint-disable-next-line no-unused-vars
  for (const [element, roles] of elementRolesMap.entries()) {
    result = [
      ...result,
      {
        match: match(element),
        roles: Array.from(roles),
        specificity: getSelectorSpecificity(element),
      },
    ]
  }

  return result.sort(bySelectorSpecificity)
}

function getRoles(container: Element, {hidden = false} = {}) {
  function flattenDOM(node: Element): Element[] {
    return [
      node,
      ...Array.from(node.children).reduce(
        (acc, child) => [...acc, ...flattenDOM(child)],
        [] as Element[],
      ),
    ]
  }

  return flattenDOM(container)
    .filter(element => {
      return hidden === false ? isInaccessible(element) === false : true
    })
    .reduce((acc, node) => {
      let roles = []
      // TODO: This violates html-aria which does not allow any role on every element
      if (node.hasAttribute('role')) {
        roles = node.getAttribute('role')!.split(' ').slice(0, 1)
      } else {
        roles = getImplicitAriaRoles(node)
      }

      return roles.reduce(
        (rolesAcc, role) =>
          Array.isArray(rolesAcc[role])
            ? {...rolesAcc, [role]: [...rolesAcc[role], node]}
            : {...rolesAcc, [role]: [node]},
        acc as Record<string, Element[]>,
      )
    }, {} as Record<string, Element[]>)
}

interface PrettyRolesOptions {
  hidden?: boolean
  includeDescription?: boolean
}
function prettyRoles(
  dom: Element,
  {hidden, includeDescription}: PrettyRolesOptions,
) {
  const roles = getRoles(dom, {hidden})
  // We prefer to skip generic role, we don't recommend it
  return Object.entries(roles)
    .filter(([role]) => role !== 'generic')
    .map(([role, elements]) => {
      const delimiterBar = '-'.repeat(50)
      const elementsString = elements
        .map(el => {
          const nameString = `Name "${computeAccessibleName(el, {
            computedStyleSupportsPseudoElements:
              getConfig().computedStyleSupportsPseudoElements,
          })}":\n`

          const domString = prettyDOM(el.cloneNode(false))

          if (includeDescription) {
            const descriptionString = `Description "${computeAccessibleDescription(
              el,
              {
                computedStyleSupportsPseudoElements:
                  getConfig().computedStyleSupportsPseudoElements,
              },
            )}":\n`
            return `${nameString}${descriptionString}${domString}`
          }

          return `${nameString}${domString}`
        })
        .join('\n\n')

      return `${role}:\n\n${elementsString}\n\n${delimiterBar}`
    })
    .join('\n')
}

interface LogRolesOptions {
  hidden?: boolean
}
const logRoles = (dom: Element, {hidden = false}: LogRolesOptions = {}) =>
  console.log(prettyRoles(dom, {hidden}))

/**
 * @param {Element} element -
 * @returns {boolean | undefined} - false/true if (not)selected, undefined if not selectable
 */
function computeAriaSelected(
  element: Element & Partial<{selected: boolean}>,
): boolean | undefined {
  // implicit value from html-aam mappings: https://www.w3.org/TR/html-aam-1.0/#html-attribute-state-and-property-mappings
  // https://www.w3.org/TR/html-aam-1.0/#details-id-97
  if (element.tagName === 'OPTION') {
    return element.selected
  }

  // explicit value
  return checkBooleanAttribute(element, 'aria-selected')
}

/**
 * @param {Element} element -
 * @returns {boolean} -
 */
function computeAriaBusy(element: Element): boolean {
  // https://www.w3.org/TR/wai-aria-1.1/#aria-busy
  return element.getAttribute('aria-busy') === 'true'
}

/**
 * @param {Element} element -
 * @returns {boolean | undefined} - false/true if (not)checked, undefined if not checked-able
 */
function computeAriaChecked(
  element: Element & Partial<{checked: boolean; indeterminate: boolean}>,
): boolean | undefined {
  // implicit value from html-aam mappings: https://www.w3.org/TR/html-aam-1.0/#html-attribute-state-and-property-mappings
  // https://www.w3.org/TR/html-aam-1.0/#details-id-56
  // https://www.w3.org/TR/html-aam-1.0/#details-id-67
  if ('indeterminate' in element && element.indeterminate) {
    return undefined
  }
  if ('checked' in element) {
    return element.checked
  }

  // explicit value
  return checkBooleanAttribute(element, 'aria-checked')
}

/**
 * @param {Element} element -
 * @returns {boolean | undefined} - false/true if (not)pressed, undefined if not press-able
 */
function computeAriaPressed(element: Element): boolean | undefined {
  // https://www.w3.org/TR/wai-aria-1.1/#aria-pressed
  return checkBooleanAttribute(element, 'aria-pressed')
}

/**
 * @param {Element} element -
 * @returns {boolean | string | null} -
 */
function computeAriaCurrent(element: Element): boolean | string | null {
  // https://www.w3.org/TR/wai-aria-1.1/#aria-current
  return (
    checkBooleanAttribute(element, 'aria-current') ??
    element.getAttribute('aria-current') ??
    false
  )
}

/**
 * @param {Element} element -
 * @returns {boolean | undefined} - false/true if (not)expanded, undefined if not expand-able
 */
function computeAriaExpanded(element: Element): boolean | undefined {
  // https://www.w3.org/TR/wai-aria-1.1/#aria-expanded
  return checkBooleanAttribute(element, 'aria-expanded')
}

function checkBooleanAttribute(
  element: Element,
  attribute: string,
): boolean | undefined {
  const attributeValue = element.getAttribute(attribute)
  if (attributeValue === 'true') {
    return true
  }
  if (attributeValue === 'false') {
    return false
  }
  return undefined
}

/**
 * @param {Element} element -
 * @returns {number | undefined} - number if implicit heading or aria-level present, otherwise undefined
 */
function computeHeadingLevel(element: Element): number | undefined {
  // https://w3c.github.io/html-aam/#el-h1-h6
  // https://w3c.github.io/html-aam/#el-h1-h6
  const implicitHeadingLevels = {
    H1: 1,
    H2: 2,
    H3: 3,
    H4: 4,
    H5: 5,
    H6: 6,
  }
  // explicit aria-level value
  // https://www.w3.org/TR/wai-aria-1.2/#aria-level
  const ariaLevelAttribute =
    element.getAttribute('aria-level') &&
    Number(element.getAttribute('aria-level'))

  const tagName = element.tagName as keyof typeof implicitHeadingLevels

  return ariaLevelAttribute || implicitHeadingLevels[tagName]
}

/**
 * @param {Element} element -
 * @returns {number | undefined} -
 */
function computeAriaValueNow(element: Element): number | undefined {
  const valueNow = element.getAttribute('aria-valuenow')
  return valueNow === null ? undefined : +valueNow
}

/**
 * @param {Element} element -
 * @returns {number | undefined} -
 */
function computeAriaValueMax(element: Element): number | undefined {
  const valueMax = element.getAttribute('aria-valuemax')
  return valueMax === null ? undefined : +valueMax
}

/**
 * @param {Element} element -
 * @returns {number | undefined} -
 */
function computeAriaValueMin(element: Element): number | undefined {
  const valueMin = element.getAttribute('aria-valuemin')
  return valueMin === null ? undefined : +valueMin
}

/**
 * @param {Element} element -
 * @returns {string | undefined} -
 */
function computeAriaValueText(element: Element): string | undefined {
  const valueText = element.getAttribute('aria-valuetext')
  return valueText === null ? undefined : valueText
}

export {
  getRoles,
  logRoles,
  getImplicitAriaRoles,
  isSubtreeInaccessible,
  prettyRoles,
  isInaccessible,
  computeAriaSelected,
  computeAriaBusy,
  computeAriaChecked,
  computeAriaPressed,
  computeAriaCurrent,
  computeAriaExpanded,
  computeAriaValueNow,
  computeAriaValueMax,
  computeAriaValueMin,
  computeAriaValueText,
  computeHeadingLevel,
}

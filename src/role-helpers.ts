import {
  elementRoles,
  ARIARoleRelationConcept,
  ARIARoleDefintionKey,
  ARIARoleRelationConceptAttribute,
} from 'aria-query'
import {computeAccessibleName} from 'dom-accessibility-api'
import {InaccessibleOptions} from '../types/role-helpers'
import {prettyDOM} from './pretty-dom'
import {getConfig} from './config'

type HeadingLevels = {
  [key: string]: number
}

type GetRolesOptions = {
  hidden: boolean
}

type ElementRole = {
  match: (node: Element) => boolean
  roles: ARIARoleDefintionKey[]
  specificity: number
}

type Roles = {[index: string]: Element[]}

const elementRoleList: ElementRole[] = buildElementRoleList(elementRoles)

/**
 * @param {Element} element -
 * @returns {boolean} - `true` if `element` and its subtree are inaccessible
 */
function isSubtreeInaccessible(element: Element) {
  if ((element as HTMLElement).hidden) {
    return true
  }

  if (element.getAttribute('aria-hidden') === 'true') {
    return true
  }

  const window = element.ownerDocument.defaultView
  if (window && window.getComputedStyle(element).display === 'none') {
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
function isInaccessible(element: Element, options: InaccessibleOptions = {}) {
  const {
    isSubtreeInaccessible: isSubtreeInaccessibleImpl = isSubtreeInaccessible,
  } = options
  const window = element.ownerDocument.defaultView
  // since visibility is inherited we can exit early
  if (window && window.getComputedStyle(element).visibility === 'hidden') {
    return true
  }

  let currentElement: Element | null = element
  while (currentElement) {
    if (isSubtreeInaccessibleImpl(currentElement)) {
      return true
    }

    currentElement = currentElement.parentElement
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

function buildElementRoleList(
  elementRolesMap: Map<ARIARoleRelationConcept, Set<ARIARoleDefintionKey>>,
) {
  function makeElementSelector(
    name: string,
    attributes: ARIARoleRelationConceptAttribute[],
  ) {
    return `${name}${attributes
      .map(({name: attributeName, value, constraints = []}) => {
        //@ts-expect-error I think there is an issue in aria-label
        const shouldNotExist = constraints.includes('undefined')
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
    {specificity: leftSpecificity}: ElementRole,
    {specificity: rightSpecificity}: ElementRole,
  ) {
    return rightSpecificity - leftSpecificity
  }

  function match(element: ARIARoleRelationConcept) {
    return (node: Element) => {
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
        if ((node as HTMLInputElement).type !== 'text') {
          return false
        }
      }

      return node.matches(makeElementSelector(element.name, attributes))
    }
  }

  let result: ElementRole[] = []

  for (const [element, roles] of Array.from(elementRolesMap.entries())) {
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

function getRoles(
  container: Element,
  {hidden}: GetRolesOptions = {hidden: false},
): Roles {
  function flattenDOM(node: Element): Element[] {
    return [
      node,
      ...Array.from(node.children).reduce<Element[]>(
        (acc, child) => [...acc, ...flattenDOM(child)],
        [],
      ),
    ]
  }

  return flattenDOM(container)
    .filter((element: Element) => {
      return hidden || !isInaccessible(element)
    })
    .reduce<Roles>((acc, node: Element) => {
      let roles = []
      // TODO: This violates html-aria which does not allow any role on every element
      const nodeRole = node.getAttribute('role')
      if (nodeRole) {
        roles = nodeRole.split(' ').slice(0, 1)
      } else {
        roles = getImplicitAriaRoles(node)
      }

      return roles.reduce(
        (rolesAcc, role) =>
          Array.isArray(rolesAcc[role])
            ? {...rolesAcc, [role]: [...rolesAcc[role], node]}
            : {...rolesAcc, [role]: [node]},
        acc,
      )
    }, {})
}

function prettyRoles(dom: Element, {hidden}: GetRolesOptions) {
  const roles = getRoles(dom, {hidden})
  // We prefer to skip generic role, we don't recommend it
  return Object.entries(roles)
    .filter(([role]) => role !== 'generic')
    .map(([role, elements]) => {
      const delimiterBar = '-'.repeat(50)
      const elementsString = elements
        .map(el => {
          const nameString = `Name "${computeAccessibleName(el, {
            computedStyleSupportsPseudoElements: getConfig()
              .computedStyleSupportsPseudoElements,
          })}":\n`
          const domString = prettyDOM(el.cloneNode(false) as Element)
          return `${nameString}${domString}`
        })
        .join('\n\n')

      return `${role}:\n\n${elementsString}\n\n${delimiterBar}`
    })
    .join('\n')
}

const logRoles = (dom: Element, {hidden}: GetRolesOptions = {hidden: false}) =>
  console.log(prettyRoles(dom, {hidden}))

/**
 * @param {Element} element -
 * @returns {boolean | undefined} - false/true if (not)selected, undefined if not selectable
 */
function computeAriaSelected(element: Element) {
  // implicit value from html-aam mappings: https://www.w3.org/TR/html-aam-1.0/#html-attribute-state-and-property-mappings
  // https://www.w3.org/TR/html-aam-1.0/#details-id-97
  if (element.tagName === 'OPTION') {
    return (element as HTMLOptionElement).selected
  }

  // explicit value
  return checkBooleanAttribute(element, 'aria-selected')
}

/**
 * @param {Element} element -
 * @returns {boolean | undefined} - false/true if (not)checked, undefined if not checked-able
 */
function computeAriaChecked(element: Element) {
  // implicit value from html-aam mappings: https://www.w3.org/TR/html-aam-1.0/#html-attribute-state-and-property-mappings
  // https://www.w3.org/TR/html-aam-1.0/#details-id-56
  // https://www.w3.org/TR/html-aam-1.0/#details-id-67
  if (
    'indeterminate' in element &&
    (element as HTMLInputElement).indeterminate
  ) {
    return undefined
  }
  if ('checked' in element) {
    return (element as HTMLInputElement).checked
  }

  // explicit value
  return checkBooleanAttribute(element, 'aria-checked')
}

/**
 * @param {Element} element -
 * @returns {boolean | undefined} - false/true if (not)pressed, undefined if not press-able
 */
function computeAriaPressed(element: Element) {
  // https://www.w3.org/TR/wai-aria-1.1/#aria-pressed
  return checkBooleanAttribute(element, 'aria-pressed')
}

/**
 * @param {Element} element -
 * @returns {boolean | undefined} - false/true if (not)expanded, undefined if not expand-able
 */
function computeAriaExpanded(element: Element) {
  // https://www.w3.org/TR/wai-aria-1.1/#aria-expanded
  return checkBooleanAttribute(element, 'aria-expanded')
}

function checkBooleanAttribute(element: Element, attribute: string) {
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
function computeHeadingLevel(element: Element) {
  // https://w3c.github.io/html-aam/#el-h1-h6
  // https://w3c.github.io/html-aam/#el-h1-h6
  const implicitHeadingLevels: HeadingLevels = {
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

  return ariaLevelAttribute ?? implicitHeadingLevels[element.tagName]
}

export {
  getRoles,
  logRoles,
  getImplicitAriaRoles,
  isSubtreeInaccessible,
  prettyRoles,
  isInaccessible,
  computeAriaSelected,
  computeAriaChecked,
  computeAriaPressed,
  computeAriaExpanded,
  computeHeadingLevel,
}

import {buildQueries, fuzzyMatches, makeNormalizer, matches} from './all-utils'
import {elementRoles} from 'aria-query'

function buildElementRoleList(elementRolesMap) {
  function makeElementSelector({name, attributes = []}) {
    return `${name}${attributes
      .map(({name: attributeName, value}) => `[${attributeName}=${value}]`)
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

const elementRoleList = buildElementRoleList(elementRoles)

function queryAllByRole(
  container,
  role,
  {exact = true, collapseWhitespace, trim, normalizer} = {},
) {
  const matcher = exact ? matches : fuzzyMatches
  const matchNormalizer = makeNormalizer({collapseWhitespace, trim, normalizer})

  function getImplicitAriaRole(currentNode) {
    for (const {selector, roles} of elementRoleList) {
      if (currentNode.matches(selector)) {
        return [...roles]
      }
    }

    return []
  }

  return Array.from(container.querySelectorAll('*')).filter(node => {
    const isRoleSpecifiedExplicitly = node.hasAttribute('role')

    if (isRoleSpecifiedExplicitly) {
      return matcher(node.getAttribute('role'), node, role, matchNormalizer)
    }

    const implicitRoles = getImplicitAriaRole(node)

    return implicitRoles.some(implicitRole =>
      matcher(implicitRole, node, role, matchNormalizer),
    )
  })
}

const getMultipleError = (c, id) => `Found multiple elements by [role=${id}]`
const getMissingError = (c, id) => `Unable to find an element by [role=${id}]`

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

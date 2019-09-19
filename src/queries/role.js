import {
  getImplicitAriaRoles,
  prettyRoles,
  shouldExcludeFromA11yTree,
} from '../role-helpers'
import {buildQueries, fuzzyMatches, makeNormalizer, matches} from './all-utils'

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

const getMissingError = (container, role, {hidden = false} = {}) => {
  const roles = prettyRoles(container, {hidden})
  let roleMessage

  if (roles.length === 0) {
    if (hidden === false) {
      roleMessage = 'There are no accessible roles.'
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
  } element with the role "${role}"

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

// It would be cleaner for this to live inside './queries', but
// other parts of the code assume that all exports from
// './queries' are query functions.
let testIdAttribute = 'data-testid'

/**
 * Configure the attribute used for xxxByTestId() queries.
 * The default attribute is 'data-testid'.
 *
 * @param {string} attr The new attribute
 */
export function configureTestIdAttribute(attr) {
  testIdAttribute = attr
}
export function getTestIdAttribute() {
  return testIdAttribute
}

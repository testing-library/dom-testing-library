/**
 * @param {Element} element -
 * @returns {boolean} - `true` if `element` and its subtree are inaccessible
 */
declare function isSubtreeInaccessible(element: HTMLElement): boolean
interface IsInaccessibleOptions {
  isSubtreeInaccessible?: typeof isSubtreeInaccessible
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
declare function isInaccessible(
  element: HTMLElement,
  options?: IsInaccessibleOptions,
): boolean
declare function getImplicitAriaRoles(currentNode: any): any[]
declare function getRoles(
  container: any,
  {
    hidden,
  }?: {
    hidden?: boolean
  },
): Record<string, Element[]>
declare function prettyRoles(
  dom: HTMLElement,
  {
    hidden,
  }: {
    hidden: any
  },
): string
declare const logRoles: (
  dom: HTMLElement,
  {
    hidden,
  }?: {
    hidden?: boolean
  },
) => void
/**
 * @param {Element} element -
 * @returns {boolean | undefined} - false/true if (not)selected, undefined if not selectable
 */
declare function computeAriaSelected(element: any): any
export {
  getRoles,
  logRoles,
  getImplicitAriaRoles,
  isSubtreeInaccessible,
  prettyRoles,
  isInaccessible,
  computeAriaSelected,
}

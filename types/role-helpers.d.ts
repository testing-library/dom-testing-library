export type InaccessibleOptions = {
  isSubtreeInaccessible?: (element: Element) => boolean
}
export function logRoles(
  container: HTMLElement,
  options: GetRolesOptions,
): string
export function getRoles(
  container: HTMLElement,
  options: GetRolesOptions,
): {[index: string]: HTMLElement[]}
/**
 * https://testing-library.com/docs/dom-testing-library/api-helpers#isinaccessible
 */
export function isInaccessible(element: Element): boolean
export function computeHeadingLevel(
  element: Element,
  options: InaccessibleOptions,
): number | undefined

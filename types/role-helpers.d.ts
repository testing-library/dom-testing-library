export function logRoles(
  container: HTMLElement,
  options?: LogRolesOptions,
): string

type LogRolesOptions = {
  hidden?: boolean
}

export function getRoles(container: HTMLElement): {
  [index: string]: HTMLElement[]
}

/**
 * https://testing-library.com/docs/dom-testing-library/api-helpers#isinaccessible
 */
export function isInaccessible(element: Element): boolean

export function computeHeadingLevel(element: Element): number | undefined

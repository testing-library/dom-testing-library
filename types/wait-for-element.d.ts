import {WaitForOptions} from './wait-for'
declare function waitForElement<T>(
  callback: () => T extends Promise<any> ? never : T,
  options?: WaitForOptions,
): Promise<T>
export {waitForElement}

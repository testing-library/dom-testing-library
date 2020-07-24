import {WaitForOptions} from './wait-for'
declare function waitForElementToBeRemoved<T extends Node>(
  callback: (() => T | T[]) | T | T[],
  options?: WaitForOptions,
): Promise<boolean>
export {waitForElementToBeRemoved}

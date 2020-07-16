import {WaitForOptions} from './wait-for'

export function waitForElementToBeRemoved<T>(
  callback: (() => T) | T,
  options?: WaitForOptions,
): Promise<T>

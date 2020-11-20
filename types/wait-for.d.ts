export interface waitForOptions {
  container?: Element
  timeout?: number
  interval?: number
  onTimeout?: (error: Error) => Error
  mutationObserverOptions?: MutationObserverInit
}

export function waitFor<T>(
  callback: () => T | Promise<T>,
  options?: waitForOptions,
): Promise<T>

export interface waitForOptions {
  container?: Element | Document
  timeout?: number
  interval?: number
  onTimeout?: (error: Error) => Error
  mutationObserverOptions?: MutationObserverInit
  showOriginalStackTrace?: boolean
}

export function waitFor<T>(
  callback: () => Promise<T> | T,
  options?: waitForOptions,
): Promise<T>

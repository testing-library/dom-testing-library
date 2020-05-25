export interface waitForOptions {
  container?: HTMLElement
  timeout?: number
  interval?: number
  mutationObserverOptions?: MutationObserverInit
}

export function waitFor<T>(
  callback: () => T extends Promise<any> ? never : T,
  options?: waitForOptions,
): Promise<T>

export function waitForElement<T>(
  callback: () => T,
  options?: {
    container?: HTMLElement
    timeout?: number
    mutationObserverOptions?: MutationObserverInit
  },
): Promise<T>

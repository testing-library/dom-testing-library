export interface WaitForOptions {
  container?: Node
  timeout?: number
  interval?: number
  mutationObserverOptions?: MutationObserverInit
  showOriginalStackTrace?: boolean
}
declare function waitForWrapper<T>(
  callback: () => T extends Promise<any> ? never : T,
  options?: WaitForOptions,
): Promise<T>
interface WaitOptions {
  container?: Node
  timeout?: number
  interval?: number
  mutationObserverOptions?: MutationObserverInit
}
declare function wait(first?: () => void, options?: WaitOptions): Promise<void>
export {waitForWrapper as waitFor, wait}

export interface WaitForOptions {
  container?: Node
  timeout?: number
  interval?: number
  mutationObserverOptions?: MutationObserverInit
  showOriginalStackTrace?: boolean
}
declare function waitForWrapper(
  callback: any,
  options?: WaitForOptions,
): Promise<any>
interface WaitOptions {
  container?: Node
  timeout?: number
  interval?: number
  mutationObserverOptions?: MutationObserverInit
}
declare function wait(first?: () => void, options?: WaitOptions): Promise<void>
export {waitForWrapper as waitFor, wait}

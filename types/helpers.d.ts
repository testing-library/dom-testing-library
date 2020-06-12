declare function runWithRealTimers(callback: any): any
declare const clearTimeoutFn: any, setImmediateFn: any, setTimeoutFn: any
declare function getDocument(): Document
declare function getWindowFromNode(node: any): any
declare function checkContainerType(container: any): void
export {
  getWindowFromNode,
  getDocument,
  clearTimeoutFn as clearTimeout,
  setImmediateFn as setImmediate,
  setTimeoutFn as setTimeout,
  runWithRealTimers,
  checkContainerType,
}

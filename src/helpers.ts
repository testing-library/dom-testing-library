import {Screen} from '../types'

const globalObj = typeof window === 'undefined' ? global : window
// Constant node.nodeType for text nodes, see:
// https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType#Node_type_constants
const TEXT_NODE = 3

// Currently this fn only supports jest timers, but it could support other test runners in the future.
function runWithRealTimers<T>(callback: () => T): T {
  return hasJestTimers()
    ? runWithJestRealTimers(callback).callbackReturnValue
    : // istanbul ignore next
      callback()
}

function hasJestTimers(): boolean {
  return (
    typeof jest !== 'undefined' &&
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    jest !== null &&
    typeof jest.useRealTimers === 'function'
  )
}

export interface TimerApi {
  clearInterval: typeof clearInterval
  clearTimeout: typeof clearTimeout
  setInterval: typeof setInterval
  setTimeout: typeof setTimeout & {clock?: unknown}
  setImmediate?: typeof setImmediate
  clearImmediate?: typeof clearImmediate
}

function runWithJestRealTimers<T>(callback: () => T) {
  const timerAPI: TimerApi = {
    clearInterval,
    clearTimeout,
    setInterval,
    setTimeout,
  }

  // For more on why we have the check here,
  // checkout https://github.com/testing-library/dom-testing-library/issues/914
  if (typeof setImmediate === 'function') {
    timerAPI.setImmediate = setImmediate
  }
  if (typeof clearImmediate === 'function') {
    timerAPI.clearImmediate = clearImmediate
  }

  jest.useRealTimers()

  const callbackReturnValue = callback()

  const usedFakeTimers = Object.entries(timerAPI).some(
    ([name, func]) => func !== globalObj[name as keyof TimerApi],
  )

  if (usedFakeTimers) {
    // eslint-disable-next-line  @typescript-eslint/no-unnecessary-condition
    jest.useFakeTimers(timerAPI.setTimeout?.clock ? 'modern' : 'legacy')
  }

  return {
    callbackReturnValue,
    usedFakeTimers,
  }
}

function jestFakeTimersAreEnabled(): boolean {
  return hasJestTimers()
    ? runWithJestRealTimers(() => {}).usedFakeTimers
    : // istanbul ignore next
      false
}

// we only run our tests in node, and setImmediate is supported in node.
// istanbul ignore next
function setImmediatePolyfill(fn: TimerHandler): number {
  return globalObj.setTimeout(fn, 0)
}

function getTimeFunctions() {
  // istanbul ignore next
  return {
    clearTimeoutFn: globalObj.clearTimeout,
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    setImmediateFn: globalObj.setImmediate || setImmediatePolyfill,
    setTimeoutFn: globalObj.setTimeout,
  }
}

const {clearTimeoutFn, setImmediateFn, setTimeoutFn} = runWithRealTimers(
  getTimeFunctions,
)

function getDocument(): Document {
  /* istanbul ignore if */
  if (typeof window === 'undefined') {
    throw new Error('Could not find default container')
  }
  return window.document
}
function getWindowFromNode(
  node: EventTarget & {
    defaultView?: (Window & typeof globalThis) | null
    ownerDocument?: Document | null
    window?: Window & typeof globalThis
  },
): Window & typeof globalThis {
  if (node.defaultView) {
    // node is document
    return node.defaultView
  } else if (node.ownerDocument?.defaultView) {
    // node is a DOM node
    return node.ownerDocument.defaultView
  } else if (node.window) {
    // node is window
    return node.window
  } else if (((node as unknown) as Promise<unknown>).then instanceof Function) {
    throw new Error(
      `It looks like you passed a Promise object instead of a DOM node. Did you do something like \`fireEvent.click(screen.findBy...\` when you meant to use a \`getBy\` query \`fireEvent.click(screen.getBy...\`, or await the findBy query \`fireEvent.click(await screen.findBy...\`?`,
    )
  } else if (Array.isArray(node)) {
    throw new Error(
      `It looks like you passed an Array instead of a DOM node. Did you do something like \`fireEvent.click(screen.getAllBy...\` when you meant to use a \`getBy\` query \`fireEvent.click(screen.getBy...\`?`,
    )
  } else if (
    typeof ((node as unknown) as Screen).debug === 'function' &&
    typeof ((node as unknown) as Screen).logTestingPlaygroundURL === 'function'
  ) {
    throw new Error(
      `It looks like you passed a \`screen\` object. Did you do something like \`fireEvent.click(screen, ...\` when you meant to use a query, e.g. \`fireEvent.click(screen.getBy..., \`?`,
    )
  } else {
    // The user passed something unusual to a calling function
    throw new Error(
      `Unable to find the "window" object for the given node. Please file an issue with the code that's causing you to see this error: https://github.com/testing-library/dom-testing-library/issues/new`,
    )
  }
}

export type Container = Document | DocumentFragment | Element

function checkContainerType(
  container: Node | null,
): asserts container is Container {
  if (
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    !container ||
    !(typeof (container as Container).querySelector === 'function') ||
    !(typeof (container as Container).querySelectorAll === 'function')
  ) {
    throw new TypeError(
      `Expected container to be an Element, a Document or a DocumentFragment but got ${getTypeName(
        container,
      )}.`,
    )
  }

  function getTypeName(object: unknown) {
    if (typeof object === 'object') {
      return object === null ? 'null' : object.constructor.name
    }
    return typeof object
  }
}

export {
  getWindowFromNode,
  getDocument,
  clearTimeoutFn as clearTimeout,
  setImmediateFn as setImmediate,
  setTimeoutFn as setTimeout,
  runWithRealTimers,
  checkContainerType,
  jestFakeTimersAreEnabled,
  TEXT_NODE,
}

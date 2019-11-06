import MutationObserver from '@sheerun/mutationobserver-shim'

const globalObj = typeof window === 'undefined' ? global : window

// Currently this fn only supports jest timers, but it could support other test runners in the future.
function runWithRealTimers(callback) {
  const usingJestFakeTimers =
    globalObj.setTimeout &&
    globalObj.setTimeout._isMockFunction &&
    typeof jest !== 'undefined'

  if (usingJestFakeTimers) {
    jest.useRealTimers()
  }

  const callbackReturnValue = callback()

  if (usingJestFakeTimers) {
    jest.useFakeTimers()
  }

  return callbackReturnValue
}

// we only run our tests in node, and setImmediate is supported in node.
// istanbul ignore next
function setImmediatePolyfill(fn) {
  return globalObj.setTimeout(fn, 0)
}

function getTimeFunctions() {
  // istanbul ignore next
  return {
    clearTimeoutFn: globalObj.clearTimeout,
    setImmediateFn: globalObj.setImmediate || setImmediatePolyfill,
    setTimeoutFn: globalObj.setTimeout,
  }
}

const {clearTimeoutFn, setImmediateFn, setTimeoutFn} = runWithRealTimers(
  getTimeFunctions,
)

function newMutationObserver(onMutation) {
  const MutationObserverConstructor =
    typeof window !== 'undefined' &&
    typeof window.MutationObserver !== 'undefined'
      ? window.MutationObserver
      : MutationObserver

  return new MutationObserverConstructor(onMutation)
}

function getDocument() {
  /* istanbul ignore if */
  if (typeof window === 'undefined') {
    throw new Error('Could not find default container')
  }
  return window.document
}

export {
  getDocument,
  newMutationObserver,
  clearTimeoutFn as clearTimeout,
  setImmediateFn as setImmediate,
  setTimeoutFn as setTimeout,
  runWithRealTimers,
}

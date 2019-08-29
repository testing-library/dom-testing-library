import MutationObserver from '@sheerun/mutationobserver-shim'

const globalObj = typeof window === 'undefined' ? global : window

// we only run our tests in node, and setImmediate is supported in node.
// istanbul ignore next
function setImmediatePolyfill(fn) {
  return globalObj.setTimeout(fn, 0)
}

function getTimeFunctions() {
  const usingJestFakeTimers = globalObj.setTimeout._isMockFunction && !!jest

  if (usingJestFakeTimers) {
    jest.useRealTimers()
  }

  const timeFunctions = {
    clearTimeoutFn: globalObj.clearTimeout,
    // istanbul ignore next
    setImmediateFn: globalObj.setImmediate || setImmediatePolyfill,
    setTimeoutFn: globalObj.setTimeout,
  }

  if (usingJestFakeTimers) {
    jest.useFakeTimers()
  }

  return timeFunctions
}

const {clearTimeoutFn, setImmediateFn, setTimeoutFn} = getTimeFunctions()

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
}

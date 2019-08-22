import MutationObserver from '@sheerun/mutationobserver-shim'

function getGlobalObj() {
  return typeof window === 'undefined' ? global : window
}

// we only run our tests in node, and setImmediate is supported in node.
// istanbul ignore next
function setImmediatePolyfill(fn) {
  return getGlobalObj().setTimeout(fn, 0)
}

function getClearTimeoutFn() {
  return getGlobalObj().clearTimeout
}
// istanbul ignore next
function getSetImmediateFn() {
  return getGlobalObj().setImmediate || setImmediatePolyfill
}

function getSetTimeoutFn() {
  return getGlobalObj().setTimeout
}

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
  getClearTimeoutFn as getClearTimeout,
  getSetImmediateFn as getSetImmediate,
  getSetTimeoutFn as getSetTimeout,
}

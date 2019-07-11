import MutationObserver from '@sheerun/mutationobserver-shim'

const globalObj = typeof window === 'undefined' ? global : window

// we only run our tests in node, and setImmediate is supported in node.
// istanbul ignore next
function setImmediatePolyfill(fn) {
  return globalObj.setTimeout(fn, 0)
}

// istanbul ignore next
const {
  setTimeout,
  clearTimeout,
  setImmediate = setImmediatePolyfill,
} = globalObj

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
  setImmediate,
  setTimeout,
  clearTimeout,
}

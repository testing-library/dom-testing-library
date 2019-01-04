import MutationObserver from '@sheerun/mutationobserver-shim'

function newMutationObserver(onMutation) {
  const MutationObserverConstructor =
    typeof window !== 'undefined' &&
    typeof window.MutationObserver !== 'undefined'
      ? window.MutationObserver
      : MutationObserver

  return new MutationObserverConstructor(onMutation)
}

function getDocument() {
  if (typeof window === 'undefined') {
    throw new Error('Could not find default container')
  }
  return window.document
}

/*
 * There are browsers for which `setImmediate` is not available. This
 * serves as a polyfill of sorts, adopting `setTimeout` as the closest
 * equivalent
 */
function getSetImmediate() {
  /* istanbul ignore else */
  if (typeof setImmediate === 'function') {
    return setImmediate
  } else {
    return function setImmediate(fn) {
      return setTimeout(fn, 0)
    }
  }
}

export {getDocument, newMutationObserver, getSetImmediate}

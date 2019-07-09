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
  /* istanbul ignore if */
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

let originalSetTimeout = global.setTimeout

if (typeof window !== 'undefined') {
  originalSetTimeout = window.setTimeout
}

let originalClearTimeout = global.clearTimeout

if (typeof window !== 'undefined') {
  originalClearTimeout = window.clearTimeout
}

/*
 * Return the original setTimeout function so that all functions work as expected by a user
 * if he/she utilizes dom-testing-library in a test where jest.fakeTimers() is used.
 *
 * global.useFakeTimers is used by us to make sure that we can still utilize fakeTimers in our tests.
 *
 * see: https://github.com/testing-library/dom-testing-library/issues/300
 */
function getSetTimeout(windowObject) {
  if (global.useFakeTimers) {
    return windowObject ? window.setTimeout : global.setTimeout
  }

  return originalSetTimeout
}

function getClearTimeout(windowObject) {
  if (global.useFakeTimers) {
    return windowObject ? window.clearTimeout : global.clearTimeout
  }

  return originalClearTimeout
}

export {
  getDocument,
  newMutationObserver,
  getSetImmediate,
  getSetTimeout,
  getClearTimeout,
}

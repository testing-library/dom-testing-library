const globalObj = typeof window === 'undefined' ? global : window

// Currently this fn only supports jest timers, but it could support other test runners in the future.
function runWithRealTimers(callback) {
  const usingJestAndTimers = typeof jest !== 'undefined' && typeof globalObj.setTimeout !== 'undefined';
  const usingLegacyJestFakeTimers = usingJestAndTimers && typeof globalObj.setTimeout._isMockFunction !== 'undefined' && globalObj.setTimeout._isMockFunction;

  let usingModernJestFakeTimers = false;
  if (
    usingJestAndTimers &&
    typeof globalObj.setTimeout.clock !== "undefined" &&
    typeof jest.getRealSystemTime !== "undefined"
  ) {
    try {
      // jest.getRealSystemTime is only supported for Jest's `modern` fake timers and otherwise throws
      jest.getRealSystemTime();
      usingModernJestFakeTimers = true;
    } catch {
      // not using Jest's modern fake timers
    }
  }

  const usingJestFakeTimers =
    usingLegacyJestFakeTimers || usingModernJestFakeTimers;

  if (usingJestFakeTimers) {
    jest.useRealTimers()
  }

  const callbackReturnValue = callback()

  if (usingJestFakeTimers) {
    jest.useFakeTimers(usingModernJestFakeTimers ? 'modern' : 'legacy')
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

const { clearTimeoutFn, setImmediateFn, setTimeoutFn } = runWithRealTimers(
  getTimeFunctions,
)

function getDocument() {
  /* istanbul ignore if */
  if (typeof window === 'undefined') {
    throw new Error('Could not find default container')
  }
  return window.document
}
function getWindowFromNode(node) {
  if (node.defaultView) {
    // node is document
    return node.defaultView
  } else if (node.ownerDocument && node.ownerDocument.defaultView) {
    // node is a DOM node
    return node.ownerDocument.defaultView
  } else if (node.window) {
    // node is window
    return node.window
  } else if (node.then instanceof Function) {
    throw new Error(
      `It looks like you passed a Promise object instead of a DOM node. Did you do something like \`fireEvent.click(screen.findBy...\` when you meant to do \`fireEvent.click(await screen.getBy...\`?`,
    )
  } else {
    // The user passed something unusual to a calling function
    throw new Error(
      `Unable to find the "window" object for the given node. Please file an issue with the code that's causing you to see this error: https://github.com/testing-library/dom-testing-library/issues/new`,
    )
  }
}

function checkContainerType(container) {
  if (
    !container ||
    !(typeof container.querySelector === 'function') ||
    !(typeof container.querySelectorAll === 'function')
  ) {
    throw new TypeError(
      `Expected container to be an Element, a Document or a DocumentFragment but got ${getTypeName(
        container,
      )}.`,
    )
  }

  function getTypeName(object) {
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
}

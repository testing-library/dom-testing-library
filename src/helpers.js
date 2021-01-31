const globalObj = typeof window === 'undefined' ? global : window
// Constant node.nodeType for text nodes, see:
// https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType#Node_type_constants
const TEXT_NODE = 3

// Currently this fn only supports jest timers, but it could support other test runners in the future.
function runWithRealTimers(callback) {
  const fakeTimersType = getJestFakeTimersType()
  if (fakeTimersType) {
    jest.useRealTimers()
  }

  const callbackReturnValue = callback()

  if (fakeTimersType) {
    jest.useFakeTimers(fakeTimersType)
  }

  return callbackReturnValue
}

function getJestFakeTimersType() {
  // istanbul ignore if
  if (
    typeof jest === 'undefined' ||
    typeof globalObj.setTimeout === 'undefined'
  ) {
    return null
  }

  if (
    typeof globalObj.setTimeout._isMockFunction !== 'undefined' &&
    globalObj.setTimeout._isMockFunction
  ) {
    return 'legacy'
  }

  if (
    typeof globalObj.setTimeout.clock !== 'undefined' &&
    typeof jest.getRealSystemTime !== 'undefined'
  ) {
    try {
      // jest.getRealSystemTime is only supported for Jest's `modern` fake timers and otherwise throws
      jest.getRealSystemTime()
      return 'modern'
    } catch {
      // not using Jest's modern fake timers
    }
  }
  return null
}

const jestFakeTimersAreEnabled = () => Boolean(getJestFakeTimersType())

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
      `It looks like you passed a Promise object instead of a DOM node. Did you do something like \`fireEvent.click(screen.findBy...\` when you meant to use a \`getBy\` query \`fireEvent.click(screen.getBy...\`, or await the findBy query \`fireEvent.click(await screen.findBy...\`?`,
    )
  } else {
    // The user passed something unusual to a calling function
    throw new Error(
      `Unable to find the "window" object for the given node. Please file an issue with the code that's causing you to see this error: https://github.com/testing-library/dom-testing-library/issues/new`,
    )
  }
}

/**
 * Check if an element is of a given type.
 *
 * @param Element The element to test
 * @param string Constructor name. E.g. 'HTMLSelectElement'
 */
function isInstanceOfElement(element, elementType) {
  try {
    const window = getWindowFromNode(element)
    // Window usually has the element constructors as properties but is not required to do so per specs
    if (typeof window[elementType] === 'function') {
      return element instanceof window[elementType]
    }
  } catch (e) {
    // The document might not be associated with a window
  }

  // Fall back to the constructor name as workaround for test environments that
  // a) not associate the document with a window
  // b) not provide the constructor as property of window
  if (/^HTML(\w+)Element$/.test(element.constructor.name)) {
    return element.constructor.name === elementType
  }

  // The user passed some node that is not created in a browser-like environment
  throw new Error(
    `Unable to verify if element is instance of ${elementType}. Please file an issue describing your test environment: https://github.com/testing-library/dom-testing-library/issues/new`,
  )
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
  jestFakeTimersAreEnabled,
  TEXT_NODE,
  isInstanceOfElement,
}

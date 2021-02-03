import {
  getDocument,
  getWindowFromNode,
  checkContainerType,
  runWithRealTimers,
} from '../helpers'

const globalObj = typeof window === 'undefined' ? global : window

afterEach(() => jest.useRealTimers())

test('returns global document if exists', () => {
  expect(getDocument()).toBe(document)
})

describe('window retrieval throws when given something other than a node', () => {
  test('Promise as node', () => {
    expect(() =>
      getWindowFromNode(new Promise(jest.fn())),
    ).toThrowErrorMatchingInlineSnapshot(
      `"It looks like you passed a Promise object instead of a DOM node. Did you do something like \`fireEvent.click(screen.findBy...\` when you meant to use a \`getBy\` query \`fireEvent.click(screen.getBy...\`, or await the findBy query \`fireEvent.click(await screen.findBy...\`?"`,
    )
  })
  test('unknown as node', () => {
    expect(() => getWindowFromNode({})).toThrowErrorMatchingInlineSnapshot(
      `"Unable to find the \\"window\\" object for the given node. Please file an issue with the code that's causing you to see this error: https://github.com/testing-library/dom-testing-library/issues/new"`,
    )
  })
})

describe('query container validation throws when validation fails', () => {
  test('undefined as container', () => {
    expect(() =>
      checkContainerType(undefined),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Expected container to be an Element, a Document or a DocumentFragment but got undefined."`,
    )
  })
  test('null as container', () => {
    expect(() => checkContainerType(null)).toThrowErrorMatchingInlineSnapshot(
      `"Expected container to be an Element, a Document or a DocumentFragment but got null."`,
    )
  })
  test('array as container', () => {
    expect(() => checkContainerType([])).toThrowErrorMatchingInlineSnapshot(
      `"Expected container to be an Element, a Document or a DocumentFragment but got Array."`,
    )
  })
  test('object as container', () => {
    expect(() => checkContainerType({})).toThrowErrorMatchingInlineSnapshot(
      `"Expected container to be an Element, a Document or a DocumentFragment but got Object."`,
    )
  })
})

describe('analyze test leak', () => {
  const realSetTimeout = global.setTimeout

  afterEach(() => {
    global.setTimeout = realSetTimeout
  })

  test('jest.getRealSystemTime does not throw after modern timers have been used', () => {
    expect(global.setTimeout).toBe(realSetTimeout)

    expect(jest.getRealSystemTime).toThrow()

    jest.useRealTimers()
    expect(global.setTimeout).toBe(realSetTimeout)

    jest.useFakeTimers('modern')
    expect(jest.getRealSystemTime).not.toThrow()

    jest.useRealTimers()
    expect(global.setTimeout).toBe(realSetTimeout)

    // current implementation assumes this throws
    // see https://github.com/testing-library/dom-testing-library/blob/5bc93643f312d9ca4210b97681686c9aa8a902d7/src/helpers.js#L43-L45
    expect(jest.getRealSystemTime).not.toThrow()

    // jest.useRealTimers() is still no problem
    jest.useRealTimers()
    expect(global.setTimeout).toBe(realSetTimeout)
  })

  test('BUG: runWithRealTimers fakes timers after modern fake timers have been used', () => {
    jest.useFakeTimers('modern')
    jest.useRealTimers()

    // modern fake timers have been used, but the current timeout is the real one
    expect(global.setTimeout).toBe(realSetTimeout)

    // repeat the test for the fake implementation
    const fakedSetTimeout = callback => {
      callback()
    }
    fakedSetTimeout.clock = jest.fn()
    global.setTimeout = fakedSetTimeout

    // runWithRealTimers assumes jest.getRealSystemTime() would throw, but it does not
    // it calls jest.useRealTimers() before the callback - which does nothing because no fake is active
    // it calls jest.useFakeTimers('modern') after the callback
    runWithRealTimers(() => {
      expect(fakedSetTimeout).toEqual(globalObj.setTimeout)
    })

    // it should be fakedSetTimeout
    expect(global.setTimeout).not.toBe(fakedSetTimeout)

    // this line makes the bug hard to track down
    // without it jest.useRealTimers() will restore fakedSetTimeout
    // with it jest.useRealTimers() 'restores' setTimeout to undefined
    global.setTimeout = realSetTimeout

    // now useRealTimers is broken
    jest.useRealTimers()
    expect(global.setTimeout).not.toBe(realSetTimeout)
  })
})

test('should always use realTimers before using callback when timers are faked with useFakeTimers', () => {
  const originalSetTimeout = globalObj.setTimeout

  // legacy timers use mocks and do not rely on a clock instance
  jest.useFakeTimers('legacy')
  runWithRealTimers(() => {
    expect(originalSetTimeout).toEqual(globalObj.setTimeout)
  })
  expect(globalObj.setTimeout._isMockFunction).toBe(true)
  expect(globalObj.setTimeout.clock).toBeUndefined()

  jest.useRealTimers()

  // modern timers use a clock instance instead of a mock
  jest.useFakeTimers('modern')
  runWithRealTimers(() => {
    expect(originalSetTimeout).toEqual(globalObj.setTimeout)
  })
  expect(globalObj.setTimeout._isMockFunction).toBeUndefined()
  expect(globalObj.setTimeout.clock).toBeDefined()
})

test('should not use realTimers when timers are not faked with useFakeTimers', () => {
  const originalSetTimeout = globalObj.setTimeout

  // useFakeTimers is not used, timers are faked in some other way
  const fakedSetTimeout = callback => {
    callback()
  }
  fakedSetTimeout.clock = jest.fn()

  globalObj.setTimeout = fakedSetTimeout

  runWithRealTimers(() => {
    expect(fakedSetTimeout).toEqual(globalObj.setTimeout)
  })

  globalObj.setTimeout = originalSetTimeout
})

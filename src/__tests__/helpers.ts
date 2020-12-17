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
      // @ts-expect-error using a promise will trhow a specific error
      getWindowFromNode(new Promise(jest.fn())),
    ).toThrowErrorMatchingInlineSnapshot(
      `"It looks like you passed a Promise object instead of a DOM node. Did you do something like \`fireEvent.click(screen.findBy...\` when you meant to use a \`getBy\` query \`fireEvent.click(screen.getBy...\`, or await the findBy query \`fireEvent.click(await screen.findBy...\`?"`,
    )
  })
  test('unknown as node', () => {
    // @ts-expect-error using an object will throw a specific error
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
    // @ts-expect-error passing a wrong container will throw an error
    expect(() => checkContainerType(null)).toThrowErrorMatchingInlineSnapshot(
      `"Expected container to be an Element, a Document or a DocumentFragment but got null."`,
    )
  })
  test('array as container', () => {
    // @ts-expect-error passing a wrong container will throw an error
    expect(() => checkContainerType([])).toThrowErrorMatchingInlineSnapshot(
      `"Expected container to be an Element, a Document or a DocumentFragment but got Array."`,
    )
  })
  test('object as container', () => {
    // @ts-expect-error passing a wrong container will throw an error
    expect(() => checkContainerType({})).toThrowErrorMatchingInlineSnapshot(
      `"Expected container to be an Element, a Document or a DocumentFragment but got Object."`,
    )
  })
})

test('should always use realTimers before using callback when timers are faked with useFakeTimers', () => {
  const originalSetTimeout = globalObj.setTimeout

  // legacy timers use mocks and do not rely on a clock instance
  jest.useFakeTimers('legacy')
  runWithRealTimers(() => {
    expect(originalSetTimeout).toEqual(globalObj.setTimeout)
  })
  // @ts-expect-error if we are using logacy timers
  expect(globalObj.setTimeout._isMockFunction).toBe(true)
  // @ts-expect-error if we are using logacy timers
  expect(globalObj.setTimeout.clock).toBeUndefined()

  jest.useRealTimers()

  // modern timers use a clock instance instead of a mock
  jest.useFakeTimers('modern')
  runWithRealTimers(() => {
    expect(originalSetTimeout).toEqual(globalObj.setTimeout)
  })
  // @ts-expect-error if we are using modern timers
  expect(globalObj.setTimeout._isMockFunction).toBeUndefined()
  // @ts-expect-error if we are using modern timers
  expect(globalObj.setTimeout.clock).toBeDefined()
})

test('should not use realTimers when timers are not faked with useFakeTimers', () => {
  const originalSetTimeout = globalObj.setTimeout

  // useFakeTimers is not used, timers are faked in some other way
  const fakedSetTimeout = (callback: () => void) => {
    callback()
  }
  fakedSetTimeout.clock = jest.fn()

  //@ts-expect-error override the default setTimeout with a fake timer
  globalObj.setTimeout = fakedSetTimeout

  runWithRealTimers(() => {
    expect(fakedSetTimeout).toEqual(globalObj.setTimeout)
  })

  globalObj.setTimeout = originalSetTimeout
})

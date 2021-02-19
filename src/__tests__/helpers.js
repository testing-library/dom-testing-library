import {
  getDocument,
  getWindowFromNode,
  checkContainerType,
  runWithRealTimers,
} from '../helpers'

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

describe('run with real timers', () => {
  const realSetTimeout = global.setTimeout

  afterEach(() => {
    // restore timers replaced by jest.useFakeTimers()
    jest.useRealTimers()
    // restore setTimeout replaced by assignment
    global.setTimeout = realSetTimeout
  })

  test('use real timers when timers are faked with jest.useFakeTimers(legacy)', () => {
    // legacy timers use mocks and do not rely on a clock instance
    jest.useFakeTimers('legacy')
    runWithRealTimers(() => {
      expect(global.setTimeout).toBe(realSetTimeout)
    })
    expect(global.setTimeout._isMockFunction).toBe(true)
    expect(global.setTimeout.clock).toBeUndefined()
  })

  test('use real timers when timers are faked with jest.useFakeTimers(modern)', () => {
    // modern timers use a clock instance instead of a mock
    jest.useFakeTimers('modern')
    runWithRealTimers(() => {
      expect(global.setTimeout).toBe(realSetTimeout)
    })
    expect(global.setTimeout._isMockFunction).toBeUndefined()
    expect(global.setTimeout.clock).toBeDefined()
  })

  test('do not use real timers when timers are not faked with jest.useFakeTimers', () => {
    // useFakeTimers is not used, timers are faked in some other way
    const fakedSetTimeout = callback => {
      callback()
    }
    fakedSetTimeout.clock = jest.fn()
    global.setTimeout = fakedSetTimeout

    runWithRealTimers(() => {
      expect(global.setTimeout).toBe(fakedSetTimeout)
    })
    expect(global.setTimeout).toBe(fakedSetTimeout)
  })
})

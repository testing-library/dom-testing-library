import {
  getDocument,
  getWindowFromNode,
  checkContainerType,
  runWithRealTimers,
  isInstanceOfElement,
} from '../helpers'
import {render} from './helpers/test-utils'

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

describe('check element type per isInstanceOfElement', () => {
  let defaultViewDescriptor, spanDescriptor
  beforeAll(() => {
    defaultViewDescriptor = Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(global.document),
      'defaultView',
    )
    spanDescriptor = Object.getOwnPropertyDescriptor(
      global.window,
      'HTMLSpanElement',
    )
  })
  afterEach(() => {
    Object.defineProperty(
      Object.getPrototypeOf(global.document),
      'defaultView',
      defaultViewDescriptor,
    )
    Object.defineProperty(global.window, 'HTMLSpanElement', spanDescriptor)
  })

  test('check in regular jest environment', () => {
    const {container} = render(`<span></span>`)

    expect(container.firstChild.ownerDocument.defaultView).toEqual(
      expect.objectContaining({
        HTMLSpanElement: expect.any(Function),
      }),
    )

    expect(isInstanceOfElement(container.firstChild, 'HTMLSpanElement')).toBe(
      true,
    )
    expect(isInstanceOfElement(container.firstChild, 'HTMLDivElement')).toBe(
      false,
    )
  })

  test('check in detached document', () => {
    const {container} = render(`<span></span>`)

    Object.defineProperty(
      Object.getPrototypeOf(container.ownerDocument),
      'defaultView',
      {value: null},
    )

    expect(container.firstChild.ownerDocument.defaultView).toBe(null)

    expect(isInstanceOfElement(container.firstChild, 'HTMLSpanElement')).toBe(
      true,
    )
    expect(isInstanceOfElement(container.firstChild, 'HTMLDivElement')).toBe(
      false,
    )
  })

  test('check in environment not providing constructors on window', () => {
    const {container} = render(`<span></span>`)

    delete global.window.HTMLSpanElement

    expect(container.firstChild.ownerDocument.defaultView.HTMLSpanElement).toBe(
      undefined,
    )

    expect(isInstanceOfElement(container.firstChild, 'HTMLSpanElement')).toBe(
      true,
    )
    expect(isInstanceOfElement(container.firstChild, 'HTMLDivElement')).toBe(
      false,
    )
  })

  test('throw error if element is not created by HTML*Element constructor', () => {
    const doc = new Document()

    // constructor is global.Element
    const element = doc.createElement('span')

    expect(() => isInstanceOfElement(element, 'HTMLSpanElement')).toThrow()
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

import {screen} from '../'
import {getDocument, getWindowFromNode, checkContainerType} from '../helpers'

test('returns global document if exists', () => {
  expect(getDocument()).toBe(document)
})

describe('window retrieval throws when given something other than a node', () => {
  // we had an issue when user insert screen instead of query
  // actually here should be another more clear error output
  test('screen as node', () => {
    expect(() => getWindowFromNode(screen)).toThrowErrorMatchingInlineSnapshot(
      `It looks like you passed a \`screen\` object. Did you do something like \`fireEvent.click(screen, ...\` when you meant to use a query, e.g. \`fireEvent.click(screen.getBy..., \`?`,
    )
  })
  test('Promise as node', () => {
    expect(() =>
      getWindowFromNode(new Promise(jest.fn())),
    ).toThrowErrorMatchingInlineSnapshot(
      `It looks like you passed a Promise object instead of a DOM node. Did you do something like \`fireEvent.click(screen.findBy...\` when you meant to use a \`getBy\` query \`fireEvent.click(screen.getBy...\`, or await the findBy query \`fireEvent.click(await screen.findBy...\`?`,
    )
  })
  test('Array as node', () => {
    expect(() => getWindowFromNode([])).toThrowErrorMatchingInlineSnapshot(
      `It looks like you passed an Array instead of a DOM node. Did you do something like \`fireEvent.click(screen.getAllBy...\` when you meant to use a \`getBy\` query \`fireEvent.click(screen.getBy...\`?`,
    )
  })
  test('window is not available for node', () => {
    const elem = document.createElement('div')
    Object.defineProperty(elem.ownerDocument, 'defaultView', {
      get: function get() {
        return null
      },
    })

    expect(() => getWindowFromNode(elem)).toThrowErrorMatchingInlineSnapshot(
      `It looks like the window object is not available for the provided node.`,
    )
  })

  test('unknown as node', () => {
    expect(() => getWindowFromNode({})).toThrowErrorMatchingInlineSnapshot(
      `The given node is not an Element, the node type is: object.`,
    )
  })
})

describe('query container validation throws when validation fails', () => {
  test('undefined as container', () => {
    expect(() =>
      checkContainerType(undefined),
    ).toThrowErrorMatchingInlineSnapshot(
      `Expected container to be an Element, a Document or a DocumentFragment but got undefined.`,
    )
  })
  test('null as container', () => {
    expect(() => checkContainerType(null)).toThrowErrorMatchingInlineSnapshot(
      `Expected container to be an Element, a Document or a DocumentFragment but got null.`,
    )
  })
  test('array as container', () => {
    expect(() => checkContainerType([])).toThrowErrorMatchingInlineSnapshot(
      `Expected container to be an Element, a Document or a DocumentFragment but got Array.`,
    )
  })
  test('object as container', () => {
    expect(() => checkContainerType({})).toThrowErrorMatchingInlineSnapshot(
      `Expected container to be an Element, a Document or a DocumentFragment but got Object.`,
    )
  })
})

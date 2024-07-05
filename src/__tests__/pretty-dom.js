/* global globalThis */
import {prettyDOM as prettyDOMImpl} from '../pretty-dom'
import {render, renderIntoDocument} from './helpers/test-utils'

function prettyDOM(...args) {
  let originalProcess
  // this shouldn't be defined in this environment in the first place
  if (typeof process === 'undefined') {
    throw new Error('process is no longer defined. Remove this setup code.')
  } else {
    originalProcess = process
    delete globalThis.process
  }

  try {
    return prettyDOMImpl(...args)
  } finally {
    globalThis.process = originalProcess
  }
}

test('prettyDOM prints out the given DOM element tree', () => {
  const {container} = render('<div>Hello World!</div>')
  expect(prettyDOM(container)).toMatchInlineSnapshot(`
    <div>
      <div>
        Hello World!
      </div>
    </div>
  `)
})

test('prettyDOM supports truncating the output length', () => {
  const {container} = render('<div>Hello World!</div>')
  expect(prettyDOM(container, 5)).toMatch(/\.\.\./)
  expect(prettyDOM(container, 0)).toMatch('')
  expect(prettyDOM(container, Number.POSITIVE_INFINITY)).toMatchInlineSnapshot(`
    <div>
      <div>
        Hello World!
      </div>
    </div>
  `)
})

test('prettyDOM defaults to document.body', () => {
  const defaultInlineSnapshot = `
  <body>
    <div>
      Hello World!
    </div>
  </body>
`
  renderIntoDocument('<div>Hello World!</div>')
  expect(prettyDOM()).toMatchInlineSnapshot(defaultInlineSnapshot)
  expect(prettyDOM(null)).toMatchInlineSnapshot(defaultInlineSnapshot)
})

test('prettyDOM supports receiving the document element', () => {
  expect(prettyDOM(document)).toMatchInlineSnapshot(`
    <html>
      <head />
      <body />
    </html>
  `)
})

describe('prettyDOM fails with first parameter without outerHTML field', () => {
  test('with array', () => {
    expect(() => prettyDOM(['outerHTML'])).toThrowErrorMatchingInlineSnapshot(
      `Expected an element or document but got Array`,
    )
  })
  test('with number', () => {
    expect(() => prettyDOM(1)).toThrowErrorMatchingInlineSnapshot(
      `Expected an element or document but got number`,
    )
  })
  test('with object', () => {
    expect(() => prettyDOM({})).toThrowErrorMatchingInlineSnapshot(
      `Expected an element or document but got Object`,
    )
  })
})

test('prettyDOM ignores script elements and comments nodes by default', () => {
  const {container} = renderIntoDocument(
    '<body><script src="context.js"></script><!-- Some comment --><p>Hello, Dave</p></body>',
  )

  expect(prettyDOM(container)).toMatchInlineSnapshot(`
    <body>
      <p>
        Hello, Dave
      </p>
    </body>
  `)
})

test('prettyDOM can include all elements with a custom filter', () => {
  const {container} = renderIntoDocument(
    '<body><script src="context.js"></script><!-- Some comment --><p>Hello, Dave</p></body>',
  )

  expect(
    prettyDOM(container, Number.POSITIVE_INFINITY, {filterNode: () => true}),
  ).toMatchInlineSnapshot(`
    <body>
      <script
        src="context.js"
      />
      <!-- Some comment -->
      <p>
        Hello, Dave
      </p>
    </body>
  `)
})

test('prettyDOM supports named custom elements', () => {
  window.customElements.define(
    'my-element-1',
    class MyElement extends HTMLElement {},
  )

  const {container} = render('<my-element-1>Hello World!</my-element-1>')

  expect(prettyDOM(container)).toMatchInlineSnapshot(`
    <div>
      <my-element-1>
        Hello World!
      </my-element-1>
    </div>
  `)
})

test('prettyDOM supports anonymous custom elements', () => {
  window.customElements.define('my-element-2', class extends HTMLElement {})

  const {container} = render('<my-element-2>Hello World!</my-element-2>')

  expect(prettyDOM(container)).toMatchInlineSnapshot(`
    <div>
      <my-element-2>
        Hello World!
      </my-element-2>
    </div>
  `)
})

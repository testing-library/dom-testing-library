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

describe('prettyDOM rejects invalid inputs', () => {
  test('with array', () => {
    expect(() => prettyDOM(['outerHTML'])).toThrowErrorMatchingInlineSnapshot(
      `Expected an element, document or shadow root but got Array`,
    )
  })
  test('with number', () => {
    expect(() => prettyDOM(1)).toThrowErrorMatchingInlineSnapshot(
      `Expected an element, document or shadow root but got number`,
    )
  })
  test('with object', () => {
    expect(() => prettyDOM({})).toThrowErrorMatchingInlineSnapshot(
      `Expected an element, document or shadow root but got Object`,
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

describe('shadow DOM', () => {
  test('prints nested open roots alongside their light DOM children', () => {
    const host = document.createElement('article')
    host.textContent = 'Slotted text'

    const root = host.attachShadow({mode: 'open'})

    root.innerHTML = '<slot></slot><section></section>'
    root.querySelector('section').attachShadow({mode: 'open'}).textContent =
      'Nested message'

    expect(prettyDOM(host)).toMatchInlineSnapshot(`
      <article>
        Slotted text
        #shadow-root
          <slot />
          <section>
            #shadow-root
              Nested message
          </section>
      </article>
    `)
  })

  test('prints a shadow root directly and filters its children', () => {
    const root = document.createElement('div').attachShadow({mode: 'open'})
    root.innerHTML = '<style>p{color:red}</style><!-- comment --><p>Saved</p>'

    expect(prettyDOM(root)).toMatchInlineSnapshot(`
      #shadow-root
        <p>
          Saved
        </p>
    `)

    expect(
      prettyDOM(root, Infinity, {filterNode: node => node.nodeName !== 'P'}),
    ).toMatchInlineSnapshot(`
      #shadow-root
        <style>
          p{color:red}
        </style>
        <!-- comment -->
    `)
  })

  test('includes the shadow tree in a failed query diagnostic', () => {
    const {container, getByRole} = render(
      '<application-status></application-status>',
    )

    container.firstChild.attachShadow({mode: 'open'}).innerHTML =
      '<div role="status">Application saved</div>'

    expect(() => getByRole('status')).toThrow('Application saved')
  })

  test('truncates long shadow content for both the host and the root', () => {
    const host = document.createElement('div')
    const root = host.attachShadow({mode: 'open'})

    root.textContent = 'A long status message inside the shadow root'

    for (const node of [host, root]) {
      expect(prettyDOM(node, 30)).toBe(`${prettyDOM(node).slice(0, 30)}...`)
    }
  })

  test('keeps a closed root private when printing its host', () => {
    const host = document.createElement('article')

    host.attachShadow({mode: 'closed'}).textContent = 'Private message'

    expect(prettyDOM(host)).toBe('<article />')
  })
})

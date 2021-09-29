import {prettyDOM, logDOM} from '../pretty-dom'
import {getUserCodeFrame} from '../get-user-code-frame'
import {render, renderIntoDocument} from './helpers/test-utils'

jest.mock('../get-user-code-frame')

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {})
})

afterEach(() => {
  console.log.mockRestore()
})

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

test('logDOM logs prettyDOM to the console', () => {
  const {container} = render('<div>Hello World!</div>')
  logDOM(container)
  expect(console.log).toHaveBeenCalledTimes(1)
  expect(console.log.mock.calls[0][0]).toMatchInlineSnapshot(`
    <div>
      <div>
        Hello World!
      </div>
    </div>
  `)
})

test('logDOM logs prettyDOM with code frame to the console', () => {
  getUserCodeFrame.mockImplementationOnce(
    () => `"/home/john/projects/sample-error/error-example.js:7:14
      5 |         document.createTextNode('Hello World!')
      6 |       )
    > 7 |       screen.debug()
        |              ^
    "
  `,
  )
  const {container} = render('<div>Hello World!</div>')
  logDOM(container)
  expect(console.log).toHaveBeenCalledTimes(1)
  expect(console.log.mock.calls[0][0]).toMatchInlineSnapshot(`
    <div>
      <div>
        Hello World!
      </div>
    </div>

    "/home/john/projects/sample-error/error-example.js:7:14
          5 |         document.createTextNode('Hello World!')
          6 |       )
        > 7 |       screen.debug()
            |              ^
        "
      
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

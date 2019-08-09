import {prettyDOM, logDOM} from '../pretty-dom'
import {render, renderIntoDocument} from './helpers/test-utils'

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {})
})

afterEach(() => {
  console.log.mockRestore()
})

test('prettyDOM prints out the given DOM element tree', () => {
  const {container} = render('<div>Hello World!</div>')
  expect(prettyDOM(container)).toMatchInlineSnapshot(`
    "<div>
      <div>
        Hello World!
      </div>
    </div>"
  `)
})

test('prettyDOM supports truncating the output length', () => {
  const {container} = render('<div>Hello World!</div>')
  expect(prettyDOM(container, 5)).toMatch(/\.\.\./)
})

test('prettyDOM defaults to document.body', () => {
  renderIntoDocument('<div>Hello World!</div>')
  expect(prettyDOM()).toMatchInlineSnapshot(`
    "<body>
      <div>
        Hello World!
      </div>
    </body>"
  `)
})

test('prettyDOM supports receiving the document element', () => {
  expect(prettyDOM(document)).toMatchInlineSnapshot(`
    "<html>
      <head />
      <body />
    </html>"
  `)
})

test('logDOM logs prettyDOM to the console', () => {
  const {container} = render('<div>Hello World!</div>')
  logDOM(container)
  expect(console.log).toHaveBeenCalledTimes(1)
  expect(console.log.mock.calls[0][0]).toMatchInlineSnapshot(`
    "<div>
      <div>
        Hello World!
      </div>
    </div>"
  `)
})

/* eslint no-console:0 */

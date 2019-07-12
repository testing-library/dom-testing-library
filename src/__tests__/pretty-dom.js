import {prettyDOM} from '../pretty-dom'
import {render} from './helpers/test-utils'

test('prints out the given DOM element tree', () => {
  const {container} = render('<div>Hello World!</div>')
  expect(prettyDOM(container)).toMatchInlineSnapshot(`
"<div>
  <div>
    Hello World!
  </div>
</div>"
`)
})

test('supports truncating the output length', () => {
  const {container} = render('<div>Hello World!</div>')
  expect(prettyDOM(container, 5)).toMatch(/\.\.\./)
})

test('supports receiving the document element', () => {
  expect(prettyDOM(document)).toMatchInlineSnapshot(`
"<html>
  <head />
  <body />
</html>"
`)
})

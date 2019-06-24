import jestSerializerAnsi from 'jest-serializer-ansi'
import {prettyDOM} from '../pretty-dom'
import {render} from './helpers/test-utils'

expect.addSnapshotSerializer(jestSerializerAnsi)

test('it prints out the given DOM element tree', () => {
  const {container} = render('<div>Hello World!</div>')
  expect(prettyDOM(container)).toMatchInlineSnapshot(`
"<div>
  <div>
    Hello World!
  </div>
</div>"
`)
})

test('it supports truncating the output length', () => {
  const {container} = render('<div>Hello World!</div>')
  expect(prettyDOM(container, 5)).toMatch(/\.\.\./)
})

test('it supports receiving the document element', () => {
  expect(prettyDOM(document)).toMatchInlineSnapshot(`
"<html>
  <head />
  <body />
</html>"
`)
})

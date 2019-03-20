import {prettyDOM} from '../pretty-dom'
import {render} from './helpers/test-utils'

test('it prints out the given DOM element tree', () => {
  const {container} = render('<div>Hello World!</div>')
  expect(prettyDOM(container)).toMatchInlineSnapshot(`
"[36m<div>[39m
  [36m<div>[39m
    [0mHello World![0m
  [36m</div>[39m
[36m</div>[39m"
`)
})

test('it supports truncating the output length', () => {
  const {container} = render('<div>Hello World!</div>')
  expect(prettyDOM(container, 5)).toMatch(/\.\.\./)
})

test('it supports receiving the document element', () => {
  expect(prettyDOM(document)).toMatchInlineSnapshot(`
"[36m<html>[39m
  [36m<head />[39m
  [36m<body />[39m
[36m</html>[39m"
`)
})

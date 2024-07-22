import {JSDOM} from 'jsdom'
import {prettyDOM} from '../pretty-dom'

function render(html) {
  const {window} = new JSDOM()
  const container = window.document.createElement('div')
  container.innerHTML = html
  return {container}
}

jest.mock('../get-user-code-frame')

test('prettyDOM supports a COLORS environment variable', () => {
  const {container} = render('<div>Hello World!</div>')

  // process.env.COLORS is a string, so make sure we test it as such
  process.env.COLORS = 'false'
  expect(prettyDOM(container)).toMatchInlineSnapshot(`
    <div>
      <div>
        Hello World!
      </div>
    </div>
  `)

  process.env.COLORS = 'true'
  expect(prettyDOM(container)).toMatchInlineSnapshot(`
    [36m<div>[39m
      [36m<div>[39m
        [0mHello World![0m
      [36m</div>[39m
    [36m</div>[39m
  `)
})

test('prettyDOM handles a COLORS env variable of unexpected object type by colorizing for node', () => {
  const {container} = render('<div>Hello World!</div>')

  const originalNodeVersion = process.versions.node
  process.env.COLORS = '{}'
  delete process.versions.node
  expect(prettyDOM(container)).toMatchInlineSnapshot(`
    <div>
      <div>
        Hello World!
      </div>
    </div>
  `)
  process.versions.node = '1.2.3'
  expect(prettyDOM(container)).toMatchInlineSnapshot(`
    [36m<div>[39m
      [36m<div>[39m
        [0mHello World![0m
      [36m</div>[39m
    [36m</div>[39m
  `)
  process.versions.node = originalNodeVersion
})

test('prettyDOM handles a COLORS env variable of undefined by colorizing for node', () => {
  const {container} = render('<div>Hello World!</div>')

  const originalNodeVersion = process.versions.node
  process.env.COLORS = undefined
  delete process.versions.node
  expect(prettyDOM(container)).toMatchInlineSnapshot(`
    <div>
      <div>
        Hello World!
      </div>
    </div>
  `)
  process.versions.node = '1.2.3'
  expect(prettyDOM(container)).toMatchInlineSnapshot(`
    [36m<div>[39m
      [36m<div>[39m
        [0mHello World![0m
      [36m</div>[39m
    [36m</div>[39m
  `)
  process.versions.node = originalNodeVersion
})

test('prettyDOM handles a COLORS env variable of empty string by colorizing for node', () => {
  const {container} = render('<div>Hello World!</div>')

  const originalNodeVersion = process.versions.node
  process.env.COLORS = ''
  delete process.versions.node
  expect(prettyDOM(container)).toMatchInlineSnapshot(`
    <div>
      <div>
        Hello World!
      </div>
    </div>
  `)
  process.versions.node = '1.2.3'
  expect(prettyDOM(container)).toMatchInlineSnapshot(`
    [36m<div>[39m
      [36m<div>[39m
        [0mHello World![0m
      [36m</div>[39m
    [36m</div>[39m
  `)
  process.versions.node = originalNodeVersion
})

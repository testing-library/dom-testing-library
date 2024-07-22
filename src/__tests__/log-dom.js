import {getUserCodeFrame} from '../get-user-code-frame'
import {logDOM} from '../pretty-dom'
import {render} from './helpers/test-utils'

jest.mock('../get-user-code-frame')

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {})
})

afterEach(() => {
  console.log.mockRestore()
})

test('logDOM logs highlighted prettyDOM to the console', () => {
  const {container} = render('<div>Hello World!</div>')
  logDOM(container)
  expect(console.log).toHaveBeenCalledTimes(1)
  expect(console.log.mock.calls[0][0]).toMatchInlineSnapshot(`
    [36m<div>[39m
      [36m<div>[39m
        [0mHello World![0m
      [36m</div>[39m
    [36m</div>[39m
  `)
})

test('logDOM logs highlighted prettyDOM with code frame to the console', () => {
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
    [36m<div>[39m
      [36m<div>[39m
        [0mHello World![0m
      [36m</div>[39m
    [36m</div>[39m

    "/home/john/projects/sample-error/error-example.js:7:14
          5 |         document.createTextNode('Hello World!')
          6 |       )
        > 7 |       screen.debug()
            |              ^
        "
      
  `)
})

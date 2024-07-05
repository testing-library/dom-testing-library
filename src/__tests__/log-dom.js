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

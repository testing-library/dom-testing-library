import fs from 'fs'
import jestSnapshotSerializerAnsi from 'jest-snapshot-serializer-ansi'
import {getUserCodeFrame} from '../get-user-code-frame'

expect.addSnapshotSerializer(jestSnapshotSerializerAnsi)

jest.mock('fs', () => ({
  // We setup the contents of a sample file
  readFileSync: jest.fn(
    () => `
    import {screen} from '@testing-library/dom'
    it('renders', () => {
      document.body.appendChild(
        document.createTextNode('Hello world')
      )
      screen.debug()
      expect(screen.getByText('Hello world')).toBeInTheDocument()
    })
  `,
  ),
}))

const userStackFrame = 'at somethingWrong (/sample-error/error-example.js:7:14)'

let globalErrorMock

beforeEach(() => {
  // Mock global.Error so we can setup our own stack messages
  globalErrorMock = jest.spyOn(global, 'Error')
})

afterEach(() => {
  global.Error.mockRestore()
})

test('it returns only user code frame when code frames from node_modules are first', () => {
  const stack = `Error: Kaboom
      at Object.<anonymous> (/sample-error/node_modules/@es2050/console/build/index.js:4:10)
      ${userStackFrame}
  `
  globalErrorMock.mockImplementationOnce(() => ({stack}))
  const userTrace = getUserCodeFrame(stack)

  expect(userTrace).toMatchInlineSnapshot(`
    /sample-error/error-example.js:7:14
      5 |         document.createTextNode('Hello world')
      6 |       )
    > 7 |       screen.debug()
        |              ^
    
  `)
})

test('it returns only user code frame when node code frames are present afterwards', () => {
  const stack = `Error: Kaboom
      at Object.<anonymous> (/sample-error/node_modules/@es2050/console/build/index.js:4:10)
      ${userStackFrame}
      at Object.<anonymous> (/sample-error/error-example.js:14:1)
      at internal/main/run_main_module.js:17:47
  `
  globalErrorMock.mockImplementationOnce(() => ({stack}))
  const userTrace = getUserCodeFrame()

  expect(userTrace).toMatchInlineSnapshot(`
    /sample-error/error-example.js:7:14
      5 |         document.createTextNode('Hello world')
      6 |       )
    > 7 |       screen.debug()
        |              ^
    
  `)
})

test("it returns empty string if file from code frame can't be read", () => {
  // Make fire read purposely fail
  fs.readFileSync.mockImplementationOnce(() => {
    throw Error()
  })
  const stack = `Error: Kaboom
      ${userStackFrame}
  `
  globalErrorMock.mockImplementationOnce(() => ({stack}))

  expect(getUserCodeFrame(stack)).toEqual('')
})

import {waitFor} from '../'
import {renderIntoDocument} from './helpers/test-utils'

test('waits callback to not throw an error', async () => {
  const spy = jest.fn()
  // we are using random timeout here to simulate a real-time example
  // of an async operation calling a callback at a non-deterministic time
  const randomTimeout = Math.floor(Math.random() * 60)
  setTimeout(spy, randomTimeout)

  await waitFor(() => expect(spy).toHaveBeenCalledTimes(1))
  expect(spy).toHaveBeenCalledWith()
})

// we used to have a limitation where we had to set an interval of 0 to 1
// otherwise there would be problems. I don't think this limitation exists
// anymore, but we'll keep this test around to make sure a problem doesn't
// crop up.
test('can accept an interval of 0', () => waitFor(() => {}, {interval: 0}))

test('can timeout after the given timeout time', async () => {
  const error = new Error('throws every time')
  const result = await waitFor(
    () => {
      throw error
    },
    {timeout: 8, interval: 5},
  ).catch(e => e)
  expect(result).toBe(error)
})

test('if no error is thrown then throws a timeout error', async () => {
  const result = await waitFor(
    () => {
      // eslint-disable-next-line no-throw-literal
      throw undefined
    },
    {timeout: 8, interval: 5, onTimeout: e => e},
  ).catch(e => e)
  expect(result).toMatchInlineSnapshot(`[Error: Timed out in waitFor.]`)
})

test('if showOriginalStackTrace on a timeout error then the stack trace does not include this file', async () => {
  const result = await waitFor(
    () => {
      // eslint-disable-next-line no-throw-literal
      throw undefined
    },
    {timeout: 8, interval: 5, showOriginalStackTrace: true},
  ).catch(e => e)
  expect(result.stack).not.toMatch(__dirname)
})

test('uses full stack error trace when showOriginalStackTrace present', async () => {
  const error = new Error('Throws the full stack trace')
  // even if the error is a TestingLibraryElementError
  error.name = 'TestingLibraryElementError'
  const originalStackTrace = error.stack
  const result = await waitFor(
    () => {
      throw error
    },
    {timeout: 8, interval: 5, showOriginalStackTrace: true},
  ).catch(e => e)
  expect(result.stack).toBe(originalStackTrace)
})

test('does not change the stack trace if the thrown error is not a TestingLibraryElementError', async () => {
  const error = new Error('Throws the full stack trace')
  const originalStackTrace = error.stack
  const result = await waitFor(
    () => {
      throw error
    },
    {timeout: 8, interval: 5},
  ).catch(e => e)
  expect(result.stack).toBe(originalStackTrace)
})

test('provides an improved stack trace if the thrown error is a TestingLibraryElementError', async () => {
  const error = new Error('Throws the full stack trace')
  error.name = 'TestingLibraryElementError'
  const originalStackTrace = error.stack
  const result = await waitFor(
    () => {
      throw error
    },
    {timeout: 8, interval: 5},
  ).catch(e => e)
  // too hard to test that the stack trace is what we want it to be
  // so we'll just make sure that it's not the same as the original
  expect(result.stack).not.toBe(originalStackTrace)
})

test('throws nice error if provided callback is not a function', () => {
  const {queryByTestId} = renderIntoDocument(`
    <div data-testid="div"></div>
  `)
  const someElement = queryByTestId('div')
  expect(() => waitFor(someElement)).toThrow(
    'Received `callback` arg must be a function',
  )
})

test('timeout logs a pretty DOM', async () => {
  renderIntoDocument(`<div id="pretty">how pretty</div>`)
  const error = await waitFor(
    () => {
      throw new Error('always throws')
    },
    {timeout: 1},
  ).catch(e => e)
  expect(error.message).toMatchInlineSnapshot(`
    "always throws

    <html>
      <head />
      <body>
        <div
          id="pretty"
        >
          how pretty
        </div>
      </body>
    </html>"
  `)
})

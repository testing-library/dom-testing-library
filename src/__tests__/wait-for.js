import {renderIntoDocument} from './helpers/test-utils'
import {waitFor} from '../'

test('waits callback to not throw an error', async () => {
  const spy = jest.fn()
  // we are using random timeout here to simulate a real-time example
  // of an async operation calling a callback at a non-deterministic time
  const randomTimeout = Math.floor(Math.random() * 60)
  setTimeout(spy, randomTimeout)

  await waitFor(() => expect(spy).toHaveBeenCalledTimes(1))
  expect(spy).toHaveBeenCalledWith()
})

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

test('uses generic error if there was no last error', async () => {
  const result = await waitFor(
    () => {
      // eslint-disable-next-line no-throw-literal
      throw undefined
    },
    {timeout: 8, interval: 5},
  ).catch(e => e)
  expect(result).toMatchInlineSnapshot(`[Error: Timed out in waitFor.]`)
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

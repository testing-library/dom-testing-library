import {waitForElement} from '../wait-for-element'
import {render, renderIntoDocument, cleanup} from './helpers/test-utils'

afterEach(cleanup)

test('waits for element to appear in the document', async () => {
  const {rerender, getByTestId} = renderIntoDocument('<div />')
  const promise = waitForElement(() => getByTestId('div'))
  setTimeout(() => rerender('<div data-testid="div" />'))
  const element = await promise
  expect(element).toBeInTheDocument()
})

test('waits for element to appear in a specified container', async () => {
  const {rerender, container, getByTestId} = render('<div />')
  const promise = waitForElement(() => getByTestId('div'), {container})
  setTimeout(() => rerender('<div data-testid="div" />'))
  const element = await promise
  expect(element).toBeTruthy()
})

test('can time out', async () => {
  jest.useFakeTimers()
  const promise = waitForElement(() => {})
  jest.advanceTimersByTime(4600)
  await expect(promise).rejects.toThrow(/timed out/i)
  jest.useRealTimers()
})

test('can specify our own timeout time', async () => {
  jest.useFakeTimers()
  const promise = waitForElement(() => {}, {timeout: 4700})
  const handler = jest.fn()
  promise.then(handler, handler)
  // advance beyond the default
  jest.advanceTimersByTime(4600)
  // promise was neither rejected nor resolved
  expect(handler).toHaveBeenCalledTimes(0)

  // advance beyond our specified timeout
  jest.advanceTimersByTime(150)

  // timed out
  await expect(promise).rejects.toThrow(/timed out/i)
  jest.useRealTimers()
})

test('throws last thrown error', async () => {
  const {rerender, container} = render('<div />')
  let error
  setTimeout(() => {
    error = new Error('first error')
    rerender('<div>first</div>')
  }, 10)
  setTimeout(() => {
    error = new Error('second error')
    rerender('<div>second</div>')
  }, 20)
  const promise = waitForElement(
    () => {
      throw error
    },
    {container, timeout: 50},
  )
  await expect(promise).rejects.toThrow(error)
})

test('waits until callback does not return null', async () => {
  const {rerender, container, queryByTestId} = render('<div />')
  const promise = waitForElement(() => queryByTestId('div'), {container})
  setTimeout(() => rerender('<div data-testid="div" />'))
  const element = await promise
  expect(element).toBeTruthy()
})

test('throws error if no callback is provided', async () => {
  await expect(waitForElement()).rejects.toThrow(/callback/i)
})

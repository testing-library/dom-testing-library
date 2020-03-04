import {render} from './helpers/test-utils'

// Because we're using fake timers here and I don't want these tests to run
// for the actual length of the test (because it's waiting for a timeout error)
// we'll mock the setTimeout, clearTimeout, and setImmediate to be the ones
// that jest will mock for us.
jest.mock('../helpers', () => {
  const actualHelpers = jest.requireActual('../helpers')
  return {
    ...actualHelpers,
    setTimeout,
    clearTimeout,
    setImmediate,
  }
})

jest.useFakeTimers()

// Because of the way jest mocking works here's the order of things (and no, the order of the code above doesn't make a difference):
// 1. Just mocks '../helpers' and setTimeout/clearTimeout/setImmediate are set to their "correct" values
// 2. We tell Jest to use fake timers
// 3. We reset the modules and we mock '../helpers' again so now setTimeout/clearTimeout/setImmediate are set to their mocked values
// We're only doing this because want to mock those values so this test doesn't take 4501ms to run.
jest.resetModules()

const {
  wait,
  waitForElement,
  waitForDomChange,
  waitForElementToBeRemoved,
} = require('../')

test('waitForElementToBeRemoved: times out after 4500ms by default', () => {
  const {container} = render(`<div></div>`)
  // there's a bug with this rule here...
  // eslint-disable-next-line jest/valid-expect
  const promise = expect(
    waitForElementToBeRemoved(() => container),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"Timed out in waitForElementToBeRemoved."`,
  )
  jest.advanceTimersByTime(4501)
  return promise
})

test('wait: can time out', async () => {
  const promise = wait(() => {
    // eslint-disable-next-line no-throw-literal
    throw undefined
  })
  jest.advanceTimersByTime(4600)
  await expect(promise).rejects.toThrow(/timed out/i)
})

test('waitForElement: can time out', async () => {
  const promise = waitForElement(() => {})
  jest.advanceTimersByTime(4600)
  await expect(promise).rejects.toThrow(/timed out/i)
})

test('waitForElement: can specify our own timeout time', async () => {
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
})

test('waitForDomChange: can time out', async () => {
  const promise = waitForDomChange()
  jest.advanceTimersByTime(4600)
  await expect(promise).rejects.toThrow(/timed out/i)
})

test('waitForDomChange: can specify our own timeout time', async () => {
  const promise = waitForDomChange({timeout: 4700})
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
})

test('wait: ensures the interval is greater than 0', async () => {
  // Arrange
  const spy = jest.fn()
  spy.mockImplementationOnce(() => {
    throw new Error('first time does not work')
  })
  const promise = wait(spy, {interval: 0})
  expect(spy).toHaveBeenCalledTimes(1)
  spy.mockClear()

  // Act
  // this line will throw an error if wait does not make the interval 1 instead of 0
  // which is why it does that!
  jest.advanceTimersByTime(0)

  // Assert
  expect(spy).toHaveBeenCalledTimes(0)
  spy.mockImplementationOnce(() => 'second time does work')

  // Act
  jest.advanceTimersByTime(1)
  await promise

  // Assert
  expect(spy).toHaveBeenCalledTimes(1)
})

test('wait: times out if it runs out of attempts', () => {
  const spy = jest.fn(() => {
    throw new Error('example error')
  })
  // there's a bug with this rule here...
  // eslint-disable-next-line jest/valid-expect
  const promise = expect(
    wait(spy, {interval: 1, timeout: 3}),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`"example error"`)
  jest.advanceTimersByTime(1)
  jest.advanceTimersByTime(1)
  jest.advanceTimersByTime(1)
  return promise
})

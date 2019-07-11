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
  waitForElement,
  waitForDomChange,
  waitForElementToBeRemoved,
} = require('../')

test('waitForElementToBeRemoved: times out after 4500ms by default', () => {
  const {container} = render(`<div></div>`)
  const promise = expect(
    waitForElementToBeRemoved(() => container),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"Timed out in waitForElementToBeRemoved."`,
  )
  jest.advanceTimersByTime(4501)
  return promise
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

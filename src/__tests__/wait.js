import {wait} from '../'

test('it waits for the data to be loaded', async () => {
  const spy = jest.fn()
  // we are using random timeout here to simulate a real-time example
  // of an async operation calling a callback at a non-deterministic time
  const randomTimeout = Math.floor(Math.random() * 60)
  setTimeout(spy, randomTimeout)

  await wait(() => expect(spy).toHaveBeenCalledTimes(1))
  expect(spy).toHaveBeenCalledWith()
})

test('can just be used for a next tick thing', async () => {
  jest.useFakeTimers()
  const spy = jest.fn()
  Promise.resolve().then(spy)
  expect(spy).toHaveBeenCalledTimes(0) // promises are always async
  await wait() // wait for next tick
  jest.advanceTimersByTime(60)
  expect(spy).toHaveBeenCalledTimes(1)
  jest.clearAllTimers()
})

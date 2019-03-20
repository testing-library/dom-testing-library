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

test('wait defaults to a noop callback', async () => {
  const handler = jest.fn()
  Promise.resolve().then(handler)
  await wait()
  expect(handler).toHaveBeenCalledTimes(1)
})

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
  const spy = jest.fn()
  Promise.resolve().then(spy)
  expect(spy).toHaveBeenCalledTimes(0) // promises are always async
  const before = Date.now()
  await wait() // wait for next tick
  const after = Date.now()
  // if it's greater than 50 then `wait` used a timeout
  // but it should have resolved sooner. It really should be 0
  expect(after - before).not.toBeGreaterThan(60)
  expect(spy).toHaveBeenCalledTimes(1)
})

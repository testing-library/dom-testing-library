import {waitFor, waitForElementToBeRemoved} from '..'
import {render} from './helpers/test-utils'

beforeAll(() => {
  jest.useFakeTimers()
})

afterAll(() => {
  jest.useRealTimers()
})

async function runWaitFor() {
  const response = 'data'
  const doAsyncThing = () =>
    new Promise(r => setTimeout(() => r(response), 300))
  let result
  doAsyncThing().then(r => (result = r))

  await waitFor(() => expect(result).toBe(response))
}

test('real timers', async () => {
  // the only difference when not using fake timers is this test will
  // have to wait the full length of the timeout
  await runWaitFor()
})

test('legacy', async () => {
  jest.useFakeTimers('legacy')
  await runWaitFor()
})

test('modern', async () => {
  jest.useFakeTimers()
  await runWaitFor()
})

test('fake timer timeout', async () => {
  jest.useFakeTimers()
  await expect(
    waitFor(
      () => {
        throw new Error('always throws')
      },
      {timeout: 10},
    ),
  ).rejects.toMatchInlineSnapshot(`[Error: always throws]`)
})

test('times out after 1000ms by default', async () => {
  const {container} = render(`<div></div>`)
  const start = performance.now()
  // there's a bug with this rule here...
  // eslint-disable-next-line jest/valid-expect
  await expect(
    waitForElementToBeRemoved(() => container),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"Timed out in waitForElementToBeRemoved."`,
  )
  // NOTE: this assertion ensures that even when we have fake timers, the
  // timeout still takes the full 1000ms
  // unfortunately, timeout clocks aren't super accurate, so we simply verify
  // that it's greater than or equal to 900ms. That's enough to be confident
  // that we're using real timers.
  expect(performance.now() - start).toBeGreaterThanOrEqual(900)
})

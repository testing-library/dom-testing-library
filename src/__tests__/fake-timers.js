import {waitFor, waitForElementToBeRemoved} from '..'
import {render} from './helpers/test-utils'

async function runWaitFor({time = 300} = {}, options) {
  const response = 'data'
  const doAsyncThing = () =>
    new Promise(r => setTimeout(() => r(response), time))
  let result
  doAsyncThing().then(r => (result = r))

  await waitFor(() => expect(result).toBe(response), options)
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
      {timeout: 10, onTimeout: e => e},
    ),
  ).rejects.toMatchInlineSnapshot(`[Error: always throws]`)
})

test('times out after 1000ms by default', async () => {
  jest.useFakeTimers()
  const {container} = render(`<div></div>`)
  const start = performance.now()
  // there's a bug with this rule here...
  // eslint-disable-next-line jest/valid-expect
  await expect(
    waitForElementToBeRemoved(() => container, {onTimeout: e => e}),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"Timed out in waitForElementToBeRemoved."`,
  )
  // NOTE: this assertion ensures that the timeout runs in the declared (fake) clock
  // while in real time the time was only a fraction since the real clock is only bound by the CPU
  // So 10ms is really just an approximation on how long the CPU needs to execute our code.
  // If people want to timeout in real time they should rely on their test runners.
  expect(performance.now() - start).toBeLessThanOrEqual(10)
})

test('recursive timers do not cause issues', async () => {
  jest.useFakeTimers()
  let recurse = true
  function startTimer() {
    setTimeout(() => {
      if (recurse) startTimer()
    }, 1)
  }

  startTimer()
  await runWaitFor({time: 800}, {timeout: 900})

  recurse = false
})

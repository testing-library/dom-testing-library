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

afterEach(() => {
  jest.useRealTimers()
})

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
  const startReal = performance.now()
  jest.useFakeTimers()
  const {container} = render(`<div></div>`)
  const startFake = performance.now()
  // there's a bug with this rule here...
  // eslint-disable-next-line jest/valid-expect
  await expect(
    waitForElementToBeRemoved(() => container, {onTimeout: e => e}),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `Timed out in waitForElementToBeRemoved.`,
  )
  // NOTE: this assertion ensures that the timeout runs in the declared (fake) clock.
  expect(performance.now() - startFake).toBeGreaterThanOrEqual(1000)
  jest.useRealTimers()
  // NOTE: this assertion ensures that the timeout runs in the declared (fake) clock
  // while in real time the time was only a fraction since the real clock is only bound by the CPU.
  // So 20ms is really just an approximation on how long the CPU needs to execute our code.
  // If people want to timeout in real time they should rely on their test runners.
  expect(performance.now() - startReal).toBeLessThanOrEqual(20)
})

test('recursive timers do not cause issues', async () => {
  jest.useFakeTimers()
  let recurse = true
  function startTimer() {
    setTimeout(() => {
      // eslint-disable-next-line jest/no-conditional-in-test -- false-positive
      if (recurse) startTimer()
    }, 1)
  }

  startTimer()
  await runWaitFor({time: 800}, {timeout: 900})

  recurse = false
})

test('legacy fake timers do waitFor requestAnimationFrame', async () => {
  jest.useFakeTimers('legacy')

  let exited = false
  requestAnimationFrame(() => {
    exited = true
  })

  await waitFor(() => {
    expect(exited).toBe(true)
  })
})

test('modern fake timers do waitFor requestAnimationFrame', async () => {
  jest.useFakeTimers('modern')

  let exited = false
  requestAnimationFrame(() => {
    exited = true
  })

  await waitFor(() => {
    expect(exited).toBe(true)
  })
})

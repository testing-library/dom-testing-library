import {waitForDomChange} from '../'
// adds special assertions like toBeTruthy
import 'jest-dom/extend-expect'
import {render} from './helpers/test-utils'

const skipSomeTime = delayMs =>
  new Promise(resolve => setTimeout(resolve, delayMs))

// Using `setTimeout` >30ms instead of `wait` here
// because `mutationobserver-shim` uses `setTimeout` ~30ms.
const skipSomeTimeForMutationObserver = (delayMs = 50) =>
  skipSomeTime(delayMs, 50)

test('it waits for the next DOM mutation', async () => {
  const successHandler = jest.fn().mockName('successHandler')
  const errorHandler = jest.fn().mockName('errorHandler')

  waitForDomChange().then(successHandler, errorHandler)

  // Promise callbacks are always asynchronous.
  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  await skipSomeTimeForMutationObserver()

  // No more expected calls without DOM mutations.
  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  document.body.appendChild(document.createElement('div'))

  await skipSomeTimeForMutationObserver()

  expect(successHandler).toHaveBeenCalledTimes(1)
  expect(successHandler.mock.calls[0]).toMatchSnapshot()
  expect(errorHandler).toHaveBeenCalledTimes(0)
})

test('it waits characterData mutation', async () => {
  const {container} = render(`<div>initial text</div>`)

  const successHandler = jest.fn().mockName('successHandler')
  const errorHandler = jest.fn().mockName('errorHandler')

  waitForDomChange({container}).then(successHandler, errorHandler)

  await skipSomeTimeForMutationObserver()

  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  container.querySelector('div').innerHTML = 'new text'
  await skipSomeTimeForMutationObserver()

  expect(successHandler).toHaveBeenCalledTimes(1)
  expect(errorHandler).toHaveBeenCalledTimes(0)
})

test('it waits for the attributes mutation', async () => {
  const {container} = render(``)

  const successHandler = jest.fn().mockName('successHandler')
  const errorHandler = jest.fn().mockName('errorHandler')

  waitForDomChange({
    container,
  }).then(successHandler, errorHandler)

  await skipSomeTimeForMutationObserver()

  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  container.setAttribute('data-test-attribute', 'PASSED')
  await skipSomeTimeForMutationObserver()

  expect(successHandler).toHaveBeenCalledTimes(1)
  expect(successHandler.mock.calls[0]).toMatchSnapshot()
})

test('it throws if timeout is exceeded', async () => {
  render('')
  const successHandler = jest.fn().mockName('successHandler')
  const errorHandler = jest.fn().mockName('errorHandler')

  waitForDomChange({timeout: 70}).then(successHandler, errorHandler)

  await skipSomeTimeForMutationObserver(100)

  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(1)
  expect(errorHandler.mock.calls[0]).toMatchInlineSnapshot(`
Array [
  [Error: Timed out in waitForDomChange.],
]
`)
})

test('does not get into infinite setTimeout loop after MutationObserver notification', async () => {
  const {container} = render(`<div data-testid="initial-element"></div>`)

  const successHandler = jest.fn().mockName('successHandler')
  const errorHandler = jest.fn().mockName('errorHandler')
  jest.useFakeTimers()

  const promise = waitForDomChange({
    container,
    timeout: 70,
    mutationObserverOptions: {attributes: true},
  }).then(successHandler, errorHandler)

  // Expect 2 timeouts to be scheduled:
  // - waitForDomChange timeout
  // - MutationObserver timeout
  expect(setTimeout).toHaveBeenCalledTimes(2)

  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  // Make a mutation
  container.setAttribute('data-test-attribute', 'something changed')

  // Advance timer to expire MutationObserver timeout
  jest.advanceTimersByTime(50)
  jest.runAllImmediates()
  await promise
  expect(setTimeout).toHaveBeenCalledTimes(3)

  // Expect successHandler to be called
  expect(successHandler).toHaveBeenCalledTimes(1)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  // Expect no more setTimeout calls
  jest.advanceTimersByTime(100)
  expect(setTimeout).toHaveBeenCalledTimes(3)
  jest.useRealTimers()
})

import {waitForDomChange} from '../'
// adds special assertions like toBeTruthy
import 'jest-dom/extend-expect'
import {render} from './helpers/test-utils'

async function skipSomeTime(delayMs) {
  await new Promise(resolve => setTimeout(resolve, delayMs))
}

async function skipSomeTimeForMutationObserver(delayMs = 50) {
  // Using `setTimeout` >30ms instead of `wait` here because `mutationobserver-shim` uses `setTimeout` ~30ms.
  await skipSomeTime(delayMs, 50)
}

test('it waits for the next DOM mutation', async () => {
  const successHandler = jest.fn().mockName('successHandler')
  const errorHandler = jest.fn().mockName('errorHandler')

  const promise = waitForDomChange().then(successHandler, errorHandler)

  // Promise callbacks are always asynchronous.
  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  await skipSomeTimeForMutationObserver()

  // No more expected calls without DOM mutations.
  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  document.body.appendChild(document.createElement('div'))
  expect(document.body).toMatchSnapshot()

  await skipSomeTimeForMutationObserver()

  expect(successHandler).toHaveBeenCalledTimes(1)
  expect(successHandler).toHaveBeenCalledWith(true)
  expect(errorHandler).toHaveBeenCalledTimes(0)
  expect(document.body).toMatchSnapshot()

  return promise
})

test('it waits characterData mutation', async () => {
  const {container} = render(`<div>initial text</div>`)

  const successHandler = jest.fn().mockName('successHandler')
  const errorHandler = jest.fn().mockName('errorHandler')

  const promise = waitForDomChange({container}).then(
    successHandler,
    errorHandler,
  )

  // Promise callbacks are always asynchronous.
  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)
  expect(container).toMatchSnapshot()

  await skipSomeTimeForMutationObserver()

  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  container.querySelector('div').innerHTML = 'new text'
  await skipSomeTimeForMutationObserver()

  expect(successHandler).toHaveBeenCalledTimes(1)
  expect(errorHandler).toHaveBeenCalledTimes(0)
  expect(container).toMatchSnapshot()

  return promise
})

test('it waits for the attributes mutation', async () => {
  const {container} = render(``)

  const successHandler = jest.fn().mockName('successHandler')
  const errorHandler = jest.fn().mockName('errorHandler')

  const promise = waitForDomChange({
    container,
  }).then(successHandler, errorHandler)

  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  await skipSomeTimeForMutationObserver()

  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  container.setAttribute('data-test-attribute', 'PASSED')
  await skipSomeTimeForMutationObserver()

  expect(successHandler).toHaveBeenCalledTimes(1)
  expect(successHandler).toHaveBeenCalledWith(true)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  return promise
})

test('it throws if timeout is exceeded', async () => {
  const {container} = render(``)

  const successHandler = jest.fn().mockName('successHandler')
  const errorHandler = jest.fn().mockName('errorHandler')

  const promise = waitForDomChange({
    container,
    timeout: 70,
    mutationObserverOptions: {attributes: true},
  }).then(successHandler, errorHandler)

  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  // no DOM update made once
  await skipSomeTimeForMutationObserver(50)

  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  // no DOM update made twice
  await skipSomeTimeForMutationObserver(50)

  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(1)
  expect(errorHandler.mock.calls[0]).toMatchSnapshot()
  expect(container).toMatchSnapshot()
  return promise
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

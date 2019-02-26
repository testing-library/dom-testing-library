import {waitForElementToBeRemoved, wait} from '../'
// adds special assertions like toBeTruthy
import 'jest-dom/extend-expect'
import {render} from './helpers/test-utils'
import document from './helpers/document'

jest.useFakeTimers()

const skipSomeTimeForMutationObserver = (delayMs = 50) => {
  jest.advanceTimersByTime(delayMs)
  jest.runAllImmediates()
}

test('it waits for the callback to throw error, a falsy value or empty array and only reacts to DOM mutations', async () => {
  const {container, getByTestId, queryAllByTestId} = render(
    `<div data-testid="initial-element">
    </div>`,
  )

  const testEle = render(
    `<div data-testid="the-element-we-are-looking-for"></div>`,
  ).container.firstChild
  testEle.parentNode.removeChild(testEle)
  container.appendChild(testEle)

  let nextElIndex = 0
  const makeMutationFn = () => () => {
    container.appendChild(
      render(
        `<div data-testid="another-element-that-causes-mutation-${++nextElIndex}"></div>`,
      ).container.firstChild,
    )
  }

  const mutationsAndCallbacks = [
    [makeMutationFn(), () => true],
    [makeMutationFn(), () => getByTestId('the-element-we-are-looking-for')],
    [
      makeMutationFn(),
      () => queryAllByTestId('the-element-we-are-looking-for'),
    ],
    [
      () =>
        container.removeChild(getByTestId('the-element-we-are-looking-for')),
      () => getByTestId('the-element-we-are-looking-for'),
    ],
  ]

  const callback = jest
    .fn(() => {
      throw new Error('No more calls are expected.')
    })
    .mockName('callback')
    .mockImplementation(() => true)

  const successHandler = jest.fn().mockName('successHandler')
  const errorHandler = jest.fn().mockName('errorHandler')

  const promise = waitForElementToBeRemoved(callback, {container}).then(
    successHandler,
    errorHandler,
  )

  // One synchronous `callback` call is expected.
  expect(callback).toHaveBeenCalledTimes(1)
  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  skipSomeTimeForMutationObserver()

  // No more expected calls without DOM mutations.
  expect(callback).toHaveBeenCalledTimes(1)
  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  // Perform mutations one by one, waiting for each to trigger `MutationObserver`.
  for (const [mutationImpl, callbackImpl] of mutationsAndCallbacks) {
    callback.mockImplementation(callbackImpl)
    mutationImpl()
    skipSomeTimeForMutationObserver()
  }

  await promise

  expect(callback).toHaveBeenCalledTimes(1 + mutationsAndCallbacks.length)
  expect(successHandler).toHaveBeenCalledTimes(1)
  expect(successHandler.mock.calls[0]).toMatchSnapshot()
  expect(errorHandler).toHaveBeenCalledTimes(0)
})

test('it waits characterData mutation', async () => {
  const {container} = render(`<div>initial text</div>`)

  const callback = jest
    .fn(() => container.textContent === 'initial text')
    .mockName('callback')
  const successHandler = jest.fn().mockName('successHandler')
  const errorHandler = jest.fn().mockName('errorHandler')

  const promise = waitForElementToBeRemoved(callback, {container}).then(
    successHandler,
    errorHandler,
  )

  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)
  expect(callback).toHaveBeenCalledTimes(1)

  skipSomeTimeForMutationObserver()

  expect(callback).toHaveBeenCalledTimes(1)
  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  container.querySelector('div').innerHTML = 'new text'
  skipSomeTimeForMutationObserver()
  await promise

  expect(successHandler).toHaveBeenCalledTimes(1)
  expect(successHandler.mock.calls[0]).toMatchSnapshot()
  expect(errorHandler).toHaveBeenCalledTimes(0)
  expect(callback).toHaveBeenCalledTimes(2)
})

test('it waits for the attributes mutation', async () => {
  const {container} = render(``)
  container.setAttribute('data-test-attribute', 'PASSED')

  const callback = jest
    .fn(() => container.getAttribute('data-test-attribute'))
    .mockName('callback')
  const successHandler = jest.fn().mockName('successHandler')
  const errorHandler = jest.fn().mockName('errorHandler')

  const promise = waitForElementToBeRemoved(callback, {
    container,
  }).then(successHandler, errorHandler)

  expect(callback).toHaveBeenCalledTimes(1)
  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  skipSomeTimeForMutationObserver()

  expect(callback).toHaveBeenCalledTimes(1)
  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  container.removeAttribute('data-test-attribute')
  skipSomeTimeForMutationObserver()
  await promise

  expect(callback).toHaveBeenCalledTimes(2)
  expect(successHandler).toHaveBeenCalledTimes(1)
  expect(successHandler.mock.calls[0]).toMatchSnapshot()
  expect(errorHandler).toHaveBeenCalledTimes(0)
})

test('it throws if timeout is exceeded', async () => {
  const {container} = render(``)

  const callback = jest.fn(() => true).mockName('callback')
  const successHandler = jest.fn().mockName('successHandler')
  const errorHandler = jest.fn().mockName('errorHandler')

  const promise = waitForElementToBeRemoved(callback, {
    container,
    timeout: 70,
    mutationObserverOptions: {attributes: true},
  }).then(successHandler, errorHandler)

  expect(callback).toHaveBeenCalledTimes(1)
  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  container.setAttribute('data-test-attribute', 'something changed once')
  skipSomeTimeForMutationObserver(50)

  expect(callback).toHaveBeenCalledTimes(2)
  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  container.setAttribute('data-test-attribute', 'something changed twice')
  skipSomeTimeForMutationObserver(50)
  await promise

  expect(callback).toHaveBeenCalledTimes(3)
  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(1)
  expect(errorHandler.mock.calls[0]).toMatchSnapshot()
})

test('it returns error immediately if there callback returns falsy value or error before any mutations', async () => {
  const {container, getByTestId, queryByTestId, queryAllByTestId} = render(``)

  const callbackForError = jest
    .fn(() => getByTestId('initial-element'))
    .mockName('callback')
  const callbackForFalsy = jest
    .fn(() => queryByTestId('initial-element'))
    .mockName('callback')
  const callbackForEmptyArray = jest
    .fn(() => queryAllByTestId('initial-element'))
    .mockName('callback')
  const successHandler = jest.fn().mockName('successHandler')
  const errorHandler = jest.fn().mockName('errorHandler')

  waitForElementToBeRemoved(callbackForError, {
    container,
    timeout: 70,
    mutationObserverOptions: {attributes: true},
  }).then(successHandler, errorHandler)
  waitForElementToBeRemoved(callbackForFalsy, {
    container,
    timeout: 70,
    mutationObserverOptions: {attributes: true},
  }).then(successHandler, errorHandler)
  waitForElementToBeRemoved(callbackForEmptyArray, {
    container,
    timeout: 70,
    mutationObserverOptions: {attributes: true},
  }).then(successHandler, errorHandler)

  expect(callbackForError).toHaveBeenCalledTimes(1)
  expect(callbackForFalsy).toHaveBeenCalledTimes(1)
  expect(callbackForEmptyArray).toHaveBeenCalledTimes(1)

  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)
  await wait()
  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(3)

  container.setAttribute('data-test-attribute', 'something changed once')
  skipSomeTimeForMutationObserver(50)

  expect(callbackForError).toHaveBeenCalledTimes(1)
  expect(callbackForFalsy).toHaveBeenCalledTimes(1)
  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(3)
  expect(errorHandler.mock.calls[0]).toMatchSnapshot()
  expect(errorHandler.mock.calls[1]).toMatchSnapshot()
  expect(errorHandler.mock.calls[3]).toMatchSnapshot()
})

test('works if a container is not defined', async () => {
  render(``)
  const el = document.createElement('p')
  document.body.appendChild(el)
  el.innerHTML = 'I changed!'
  const callback = jest
    .fn(() => el.textContent === 'I changed!')
    .mockName('callback')
  const successHandler = jest.fn().mockName('successHandler')
  const errorHandler = jest.fn().mockName('errorHandler')

  let promise
  if (typeof window === 'undefined') {
    promise = waitForElementToBeRemoved(callback, {container: document}).then(
      successHandler,
      errorHandler,
    )
  } else {
    promise = waitForElementToBeRemoved(callback).then(
      successHandler,
      errorHandler,
    )
  }

  skipSomeTimeForMutationObserver()

  expect(callback).toHaveBeenCalledTimes(1)
  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  el.innerHTML = 'Changed!'
  skipSomeTimeForMutationObserver()
  await promise

  expect(callback).toHaveBeenCalledTimes(2)
  expect(successHandler).toHaveBeenCalledTimes(1)
  expect(successHandler.mock.calls[0]).toMatchSnapshot()
  expect(errorHandler).toHaveBeenCalledTimes(0)

  document.getElementsByTagName('html')[0].innerHTML = '' // cleans the document
})

test('throws an error if callback is not a function', async () => {
  const successHandler = jest.fn().mockName('successHandler')
  const errorHandler = jest.fn().mockName('errorHandler')

  let promise
  if (typeof window === 'undefined') {
    promise = waitForElementToBeRemoved(undefined, {container: document}).then(
      successHandler,
      errorHandler,
    )
  } else {
    promise = waitForElementToBeRemoved().then(successHandler, errorHandler)
  }

  skipSomeTimeForMutationObserver()
  await promise

  expect(errorHandler).toHaveBeenCalledTimes(1)
  expect(errorHandler.mock.calls[0]).toMatchSnapshot()
  expect(successHandler).toHaveBeenCalledTimes(0)
})

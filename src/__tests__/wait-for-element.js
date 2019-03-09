import {waitForElement, wait} from '../'
// adds special assertions like toBeTruthy
import 'jest-dom/extend-expect'
import {render} from './helpers/test-utils'

const skipSomeTime = delayMs =>
  new Promise(resolve => setTimeout(resolve, delayMs))

// Using `setTimeout` >30ms instead of `wait` here because `mutationobserver-shim` uses `setTimeout` ~30ms.
const skipSomeTimeForMutationObserver = (delayMs = 50) =>
  skipSomeTime(delayMs, 50)

test('it waits for the callback to return a value and only reacts to DOM mutations', async () => {
  const {container, getByTestId} = render(
    `<div data-testid="initial-element"></div>`,
  )

  let nextElIndex = 0
  const makeMutationFn = () => () => {
    container.appendChild(
      render(
        `<div data-testid="another-element-that-causes-mutation-${++nextElIndex}"></div>`,
      ).container.firstChild,
    )
  }

  const testEl = render(
    `<div data-testid="the-element-we-are-looking-for"></div>`,
  ).container.firstChild
  testEl.parentNode.removeChild(testEl)

  const mutationsAndCallbacks = [
    [
      makeMutationFn(),
      () => {
        throw new Error('First exception.')
      },
    ],
    [
      makeMutationFn(),
      () => {
        throw new Error('Second exception.')
      },
    ],
    [makeMutationFn(), () => null],
    [makeMutationFn(), () => undefined],
    [makeMutationFn(), () => getByTestId('the-element-we-are-looking-for')],
    [
      () => container.appendChild(testEl),
      () => getByTestId('the-element-we-are-looking-for'),
    ],
  ]

  const callback = jest
    .fn(() => {
      throw new Error('No more calls are expected.')
    })
    .mockName('callback')
    .mockImplementation(() => {
      throw new Error(
        'First callback call is synchronous, not returning any elements.',
      )
    })
  const successHandler = jest.fn().mockName('successHandler')
  const errorHandler = jest.fn().mockName('errorHandler')

  waitForElement(callback, {container}).then(successHandler, errorHandler)

  // One synchronous `callback` call is expected.
  expect(callback).toHaveBeenCalledTimes(1)
  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  await skipSomeTimeForMutationObserver()

  // No more expected calls without DOM mutations.
  expect(callback).toHaveBeenCalledTimes(1)
  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  // Perform mutations one by one, waiting for each to trigger `MutationObserver`.
  for (const [mutationImpl, callbackImpl] of mutationsAndCallbacks) {
    callback.mockImplementation(callbackImpl)
    mutationImpl()
    await skipSomeTimeForMutationObserver() // eslint-disable-line no-await-in-loop
  }

  expect(callback).toHaveBeenCalledTimes(1 + mutationsAndCallbacks.length)
  expect(successHandler).toHaveBeenCalledTimes(1)
  expect(successHandler).toHaveBeenCalledWith(testEl)
  expect(errorHandler).toHaveBeenCalledTimes(0)
  expect(container).toMatchSnapshot()
  expect(testEl.parentNode).toBe(container)
})

test('it waits characterData mutation', async () => {
  const {container} = render(`<div>initial text</div>`)

  const callback = jest
    .fn(() => container.textContent === 'new text')
    .mockName('callback')
  const successHandler = jest.fn().mockName('successHandler')
  const errorHandler = jest.fn().mockName('errorHandler')

  waitForElement(callback, {container}).then(successHandler, errorHandler)

  // Promise callbacks are always asynchronous.
  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)
  expect(callback).toHaveBeenCalledTimes(1)
  expect(container).toMatchSnapshot()

  await skipSomeTimeForMutationObserver()

  expect(callback).toHaveBeenCalledTimes(1)
  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  container.querySelector('div').innerHTML = 'new text'
  await skipSomeTimeForMutationObserver()

  expect(successHandler).toHaveBeenCalledTimes(1)
  expect(errorHandler).toHaveBeenCalledTimes(0)
  expect(callback).toHaveBeenCalledTimes(2)
  expect(container).toMatchSnapshot()
})

test('it waits for the attributes mutation', async () => {
  const {container} = render(``)

  const callback = jest
    .fn(() => container.getAttribute('data-test-attribute'))
    .mockName('callback')
  const successHandler = jest.fn().mockName('successHandler')
  const errorHandler = jest.fn().mockName('errorHandler')

  waitForElement(callback, {
    container,
  }).then(successHandler, errorHandler)

  expect(callback).toHaveBeenCalledTimes(1)
  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  await skipSomeTimeForMutationObserver()

  expect(callback).toHaveBeenCalledTimes(1)
  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  container.setAttribute('data-test-attribute', 'PASSED')
  await skipSomeTimeForMutationObserver()

  expect(callback).toHaveBeenCalledTimes(2)
  expect(successHandler).toHaveBeenCalledTimes(1)
  expect(successHandler).toHaveBeenCalledWith('PASSED')
  expect(errorHandler).toHaveBeenCalledTimes(0)
})

test('it throws if timeout is exceeded', async () => {
  const {container} = render(``)

  const callback = jest.fn(() => null).mockName('callback')
  const successHandler = jest.fn().mockName('successHandler')
  const errorHandler = jest.fn().mockName('errorHandler')

  waitForElement(callback, {
    container,
    timeout: 70,
    mutationObserverOptions: {attributes: true},
  }).then(successHandler, errorHandler)

  expect(callback).toHaveBeenCalledTimes(1)
  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  container.setAttribute('data-test-attribute', 'something changed once')
  await skipSomeTimeForMutationObserver(50)

  expect(callback).toHaveBeenCalledTimes(2)
  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  container.setAttribute('data-test-attribute', 'something changed twice')
  await skipSomeTimeForMutationObserver(50)

  expect(callback).toHaveBeenCalledTimes(3)
  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(1)
  expect(errorHandler.mock.calls[0]).toMatchSnapshot()
  expect(container).toMatchSnapshot()
})

test('it throws the same error that the callback has thrown if timeout is exceeded', async () => {
  const {container, getByTestId} = render(``)

  const callback = jest.fn(() => getByTestId('test')).mockName('callback')
  const successHandler = jest.fn().mockName('successHandler')
  const errorHandler = jest.fn().mockName('errorHandler')

  waitForElement(callback, {
    container,
    timeout: 70,
    mutationObserverOptions: {attributes: true},
  }).then(successHandler, errorHandler)

  expect(callback).toHaveBeenCalledTimes(1)
  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  container.setAttribute('data-test-attribute', 'something changed once')
  await skipSomeTimeForMutationObserver(50)

  expect(callback).toHaveBeenCalledTimes(2)
  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  container.setAttribute('data-test-attribute', 'something changed twice')
  await skipSomeTimeForMutationObserver(50)

  expect(callback).toHaveBeenCalledTimes(3)
  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(1)
  expect(errorHandler.mock.calls[0]).toMatchSnapshot()
  expect(container).toMatchSnapshot()
})

test('it returns immediately if the callback returns the value before any mutations', async () => {
  const {container, getByTestId} = render(
    `<div data-testid="initial-element"></div>`,
  )

  const callback = jest
    .fn(() => getByTestId('initial-element'))
    .mockName('callback')
  const successHandler = jest.fn().mockName('successHandler')
  const errorHandler = jest.fn().mockName('errorHandler')

  waitForElement(callback, {
    container,
    timeout: 70,
    mutationObserverOptions: {attributes: true},
  }).then(successHandler, errorHandler)

  // One synchronous `callback` call is expected.
  expect(callback).toHaveBeenCalledTimes(1)

  // The promise callbacks are expected to be called asyncronously.
  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)
  await wait()
  expect(successHandler).toHaveBeenCalledTimes(1)
  expect(successHandler).toHaveBeenCalledWith(container.firstChild)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  container.setAttribute('data-test-attribute', 'something changed once')
  await skipSomeTimeForMutationObserver(50)

  // No more calls are expected.
  expect(callback).toHaveBeenCalledTimes(1)
  expect(successHandler).toHaveBeenCalledTimes(1)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  expect(container).toMatchSnapshot()
})

test('does not get into infinite setTimeout loop after MutationObserver notification', async () => {
  const {container} = render(`<div data-testid="initial-element"></div>`)

  let didMakeMutation = false
  const callback = jest.fn(() => didMakeMutation).mockName('callback')
  const successHandler = jest.fn().mockName('successHandler')
  const errorHandler = jest.fn().mockName('errorHandler')
  jest.useFakeTimers()

  const promise = waitForElement(callback, {
    container,
    timeout: 70,
    mutationObserverOptions: {attributes: true},
  }).then(successHandler, errorHandler)

  // Expect 2 timeouts to be scheduled:
  // - waitForElement timeout
  // - MutationObserver timeout
  expect(setTimeout).toHaveBeenCalledTimes(2)

  // One synchronous `callback` call is expected.
  expect(callback).toHaveBeenCalledTimes(1)
  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  // Make a mutation so MutationObserver calls out callback
  container.setAttribute('data-test-attribute', 'something changed')
  didMakeMutation = true

  // Advance timer to expire MutationObserver timeout
  jest.advanceTimersByTime(50)
  jest.runAllImmediates()
  await promise
  expect(setTimeout).toHaveBeenCalledTimes(3)

  // Expect callback and successHandler to be called
  expect(callback).toHaveBeenCalledTimes(2)
  expect(successHandler).toHaveBeenCalledTimes(1)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  // Expect no more setTimeout calls
  jest.advanceTimersByTime(100)
  expect(setTimeout).toHaveBeenCalledTimes(3)
  jest.useRealTimers()
})

test('works if a container is not defined', async () => {
  render(``)
  const el = document.createElement('p')
  document.body.appendChild(el)
  const callback = jest
    .fn(() => el.textContent === 'I changed!')
    .mockName('callback')
  const successHandler = jest.fn().mockName('successHandler')
  const errorHandler = jest.fn().mockName('errorHandler')

  if (typeof window === 'undefined') {
    waitForElement(callback, {container: document}).then(
      successHandler,
      errorHandler,
    )
  } else {
    waitForElement(callback).then(successHandler, errorHandler)
  }

  await skipSomeTimeForMutationObserver()

  expect(callback).toHaveBeenCalledTimes(1)
  expect(successHandler).toHaveBeenCalledTimes(0)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  el.innerHTML = 'I changed!'
  await skipSomeTimeForMutationObserver()

  expect(callback).toHaveBeenCalledTimes(2)
  expect(successHandler).toHaveBeenCalledTimes(1)
  expect(errorHandler).toHaveBeenCalledTimes(0)

  document.getElementsByTagName('html')[0].innerHTML = '' // cleans the document
})

test('throws an error if callback is not a function', async () => {
  const successHandler = jest.fn().mockName('successHandler')
  const errorHandler = jest.fn().mockName('errorHandler')

  if (typeof window === 'undefined') {
    waitForElement(undefined, {container: document}).then(
      successHandler,
      errorHandler,
    )
  } else {
    waitForElement().then(successHandler, errorHandler)
  }

  await skipSomeTimeForMutationObserver()

  expect(errorHandler).toHaveBeenLastCalledWith(
    'waitForElement requires a callback as the first parameter',
  )
  expect(successHandler).toHaveBeenCalledTimes(0)
})

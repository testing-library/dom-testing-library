import {waitForElement} from '../wait-for-element'
import {render, renderIntoDocument} from './helpers/test-utils'

test('waits for element to appear in the document', async () => {
  const {rerender, getByTestId} = renderIntoDocument('<div />')
  const promise = waitForElement(() => getByTestId('div'))
  setTimeout(() => rerender('<div data-testid="div" />'))
  const element = await promise
  expect(element).toBeInTheDocument()
})

test('waits for element to appear in a specified container', async () => {
  const {rerender, container, getByTestId} = render('<div />')
  const promise = waitForElement(() => getByTestId('div'), {container})
  setTimeout(() => rerender('<div data-testid="div" />'))
  const element = await promise
  expect(element).toBeTruthy()
})

test('throws last thrown error', async () => {
  const {rerender, container} = render('<div />')
  let error
  setTimeout(() => {
    error = new Error('first error')
    rerender('<div>first</div>')
  }, 10)
  setTimeout(() => {
    error = new Error('second error')
    rerender('<div>second</div>')
  }, 20)
  const promise = waitForElement(
    () => {
      throw error
    },
    {container, timeout: 50},
  )
  await expect(promise).rejects.toThrow(error)
})

test('waits until callback does not return null', async () => {
  const {rerender, container, queryByTestId} = render('<div />')
  const promise = waitForElement(() => queryByTestId('div'), {container})
  setTimeout(() => rerender('<div data-testid="div" />'))
  const element = await promise
  expect(element).toBeTruthy()
})

test('throws error if no callback is provided', async () => {
  await expect(waitForElement()).rejects.toThrow(/callback/i)
})

test('uses real timers even if they were set to fake before importing the module', async () => {
  jest.resetModules()
  jest.useFakeTimers()
  const importedWaitForElement = require('../').waitForElement

  const {rerender, getByTestId} = renderIntoDocument('<div />')

  setTimeout(() => rerender('<div data-testid="div" />'), 1000)

  await expect(
    importedWaitForElement(() => getByTestId('div'), {timeout: 200}),
  ).rejects.toThrow(/Unable to find/i)
})

test("doesn't change jest's timers value when importing the module", () => {
  jest.resetModules()
  jest.useFakeTimers()
  // eslint-disable-next-line
  require('../').waitForElement

  expect(window.setTimeout._isMockFunction).toEqual(true)
})

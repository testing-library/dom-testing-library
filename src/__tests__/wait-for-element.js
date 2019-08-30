import {render, renderIntoDocument} from './helpers/test-utils'

function importModule() {
  return require('../').waitForElement
}

let waitForElement

beforeEach(() => {
  jest.useRealTimers()
  jest.resetModules()
  waitForElement = importModule()
})

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

describe('timers', () => {
  const expectElementToExist = async () => {
    const importedWaitForElement = importModule()

    const {rerender, getByTestId} = renderIntoDocument('<div />')

    setTimeout(() => rerender('<div data-testid="div" />'), 100)

    const promise = importedWaitForElement(() => getByTestId('div'), {
      timeout: 200,
    })

    if (setTimeout._isMockFunction) {
      jest.advanceTimersByTime(110)
    }

    const element = await promise

    await expect(element).toBeInTheDocument()
  }

  it('works with real timers', async () => {
    jest.useRealTimers()
    await expectElementToExist()
  })
  it('works with fake timers', async () => {
    jest.useFakeTimers()
    await expectElementToExist()
  })
})

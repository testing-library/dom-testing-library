import {renderIntoDocument} from './helpers/test-utils'

function importModule() {
  return require('../').waitForElementToBeRemoved
}

let waitForElementToBeRemoved

beforeEach(() => {
  jest.useRealTimers()
  jest.resetModules()
  waitForElementToBeRemoved = importModule()
})

test('resolves on mutation only when the element is removed', async () => {
  const {queryAllByTestId} = renderIntoDocument(`
    <div data-testid="div"></div>
    <div data-testid="div"></div>
  `)
  const divs = queryAllByTestId('div')
  // first mutation
  setTimeout(() => {
    divs.forEach(d => d.setAttribute('id', 'mutated'))
  })
  // removal
  setTimeout(() => {
    divs.forEach(div => div.parentElement.removeChild(div))
  }, 100)
  // the timeout is here for two reasons:
  // 1. It helps test the timeout config
  // 2. The element should be removed immediately
  //    so if it doesn't in the first 100ms then we know something's wrong
  //    so we'll fail early and not wait the full timeout
  await waitForElementToBeRemoved(() => queryAllByTestId('div'), {timeout: 200})
})

test('resolves on mutation if callback throws an error', async () => {
  const {getByTestId} = renderIntoDocument(`
  <div data-testid="div"></div>
`)
  const div = getByTestId('div')
  setTimeout(() => {
    div.parentElement.removeChild(div)
  })
  await waitForElementToBeRemoved(() => getByTestId('div'), {timeout: 100})
})

test('requires an element to exist first', () => {
  return expect(
    waitForElementToBeRemoved(null),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"The element(s) given to waitForElementToBeRemoved are already removed. waitForElementToBeRemoved requires that the element(s) exist(s) before waiting for removal."`,
  )
})

test('requires an unempty array of elements to exist first', () => {
  return expect(
    waitForElementToBeRemoved([]),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"The element(s) given to waitForElementToBeRemoved are already removed. waitForElementToBeRemoved requires that the element(s) exist(s) before waiting for removal."`,
  )
})

test('requires an element to exist first (function form)', () => {
  return expect(
    waitForElementToBeRemoved(() => null),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"The element(s) given to waitForElementToBeRemoved are already removed. waitForElementToBeRemoved requires that the element(s) exist(s) before waiting for removal."`,
  )
})

test('requires an unempty array of elements to exist first (function form)', () => {
  return expect(
    waitForElementToBeRemoved(() => []),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"The element(s) given to waitForElementToBeRemoved are already removed. waitForElementToBeRemoved requires that the element(s) exist(s) before waiting for removal."`,
  )
})

describe('timers', () => {
  const expectElementToBeRemoved = async () => {
    const importedWaitForElementToBeRemoved = importModule()

    const {queryAllByTestId} = renderIntoDocument(`
  <div data-testid="div"></div>
  <div data-testid="div"></div>
`)
    const divs = queryAllByTestId('div')
    // first mutation
    setTimeout(() => {
      divs.forEach(d => d.setAttribute('id', 'mutated'))
    })
    // removal
    setTimeout(() => {
      divs.forEach(div => div.parentElement.removeChild(div))
    }, 100)

    const promise = importedWaitForElementToBeRemoved(
      () => queryAllByTestId('div'),
      {
        timeout: 200,
      },
    )

    if (setTimeout._isMockFunction) {
      jest.advanceTimersByTime(110)
    }

    await promise
  }

  it('works with real timers', async () => {
    jest.useRealTimers()
    await expectElementToBeRemoved()
  })
  it('works with fake timers', async () => {
    jest.useFakeTimers()
    await expectElementToBeRemoved()
  })
})

test("doesn't change jest's timers value when importing the module", () => {
  jest.useFakeTimers()
  importModule()

  expect(window.setTimeout._isMockFunction).toEqual(true)
})

test('rethrows non-testing-lib errors', () => {
  let throwIt = false
  const div = document.createElement('div')
  const error = new Error('my own error')
  return expect(
    waitForElementToBeRemoved(() => {
      if (throwIt) {
        throw error
      }
      throwIt = true
      return div
    }),
  ).rejects.toBe(error)
})

test('logs timeout error when it times out', async () => {
  const div = document.createElement('div')
  await expect(
    waitForElementToBeRemoved(() => div, {timeout: 1}),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"Timed out in waitForElementToBeRemoved."`,
  )
})

test('accepts an element as an argument and waits for it to be removed from its top-most parent', async () => {
  const {queryByTestId} = renderIntoDocument(`
    <div data-testid="div"></div>
  `)
  const div = queryByTestId('div')
  setTimeout(() => {
    div.parentElement.removeChild(div)
  }, 20)

  await waitForElementToBeRemoved(div, {timeout: 200})
})

test('accepts an array of elements as an argument and waits for those elements to be removed from their top-most parent', async () => {
  const {queryAllByTestId} = renderIntoDocument(`
    <div>
      <div>
        <div data-testid="div"></div>
      </div>
      <div>
        <div data-testid="div"></div>
      </div>
    </div>
  `)
  const [div1, div2] = queryAllByTestId('div')
  setTimeout(() => {
    div1.parentElement.removeChild(div1)
  }, 20)

  setTimeout(() => {
    div2.parentElement.removeChild(div2)
  }, 50)
  await waitForElementToBeRemoved([div1, div2], {timeout: 200})
})

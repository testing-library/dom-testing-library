import {renderIntoDocument} from './helpers/test-utils'

function importModule() {
  return require('../').waitForDomChange
}

let waitForDomChange

beforeEach(() => {
  jest.useRealTimers()
  jest.resetModules()
  waitForDomChange = importModule()
  console.warn.mockClear()
})

test('waits for the dom to change in the document', async () => {
  const {container} = renderIntoDocument('<div />')
  const promise = waitForDomChange()
  setTimeout(() => container.firstChild.setAttribute('id', 'foo'))
  const mutationResult = await promise
  expect(mutationResult).toMatchInlineSnapshot(`
    Array [
      Object {
        "addedNodes": NodeList [],
        "attributeName": "id",
        "attributeNamespace": null,
        "nextSibling": null,
        "oldValue": null,
        "previousSibling": null,
        "removedNodes": NodeList [],
        "target": <div
          id="foo"
        />,
        "type": "attributes",
      },
    ]
  `)
  expect(console.warn.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    "\`waitForDomChange\` has been deprecated. Use \`waitFor\` instead: https://testing-library.com/docs/dom-testing-library/api-async#waitfor.",
  ],
]
`)
})

test('waits for the dom to change in a specified container', async () => {
  const {container} = renderIntoDocument('<div />')
  const promise = waitForDomChange({container})
  setTimeout(() => container.firstChild.setAttribute('id', 'foo'))
  const mutationResult = await promise
  expect(mutationResult).toMatchInlineSnapshot(`
    Array [
      Object {
        "addedNodes": NodeList [],
        "attributeName": "id",
        "attributeNamespace": null,
        "nextSibling": null,
        "oldValue": null,
        "previousSibling": null,
        "removedNodes": NodeList [],
        "target": <div
          id="foo"
        />,
        "type": "attributes",
      },
    ]
  `)
})

describe('timers', () => {
  const expectElementToChange = async () => {
    const importedWaitForDomChange = importModule()
    const {container} = renderIntoDocument('<div />')

    setTimeout(() => container.firstChild.setAttribute('id', 'foo'), 100)

    const promise = importedWaitForDomChange({container, timeout: 200})

    if (setTimeout._isMockFunction) {
      jest.advanceTimersByTime(110)
    }

    await expect(promise).resolves.toMatchSnapshot()
  }

  it('works with real timers', async () => {
    jest.useRealTimers()
    await expectElementToChange()
  })
  it('works with fake timers', async () => {
    jest.useFakeTimers()
    await expectElementToChange()
  })
})

test("doesn't change jest's timers value when importing the module", () => {
  jest.useFakeTimers()
  importModule()

  expect(window.setTimeout._isMockFunction).toEqual(true)
})

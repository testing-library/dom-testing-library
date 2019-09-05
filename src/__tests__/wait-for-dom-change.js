import {renderIntoDocument} from './helpers/test-utils'

function importModule() {
  return require('../').waitForDomChange
}

let waitForDomChange

beforeEach(() => {
  jest.useRealTimers()
  jest.resetModules()
  waitForDomChange = importModule()
})

test('waits for the dom to change in the document', async () => {
  const {container} = renderIntoDocument('<div />')
  const promise = waitForDomChange()
  setTimeout(() => container.firstChild.setAttribute('id', 'foo'))
  const mutationResult = await promise
  expect(mutationResult).toMatchInlineSnapshot(`
Array [
  Object {
    "addedNodes": Array [],
    "attributeName": "id",
    "attributeNamespace": null,
    "nextSibling": null,
    "oldValue": null,
    "previousSibling": null,
    "removedNodes": Array [],
    "target": <div
      id="foo"
    />,
    "type": "attributes",
  },
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
    "addedNodes": Array [],
    "attributeName": "id",
    "attributeNamespace": null,
    "nextSibling": null,
    "oldValue": null,
    "previousSibling": null,
    "removedNodes": Array [],
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

    await expect(promise).resolves.toMatchInlineSnapshot(`
  Array [
    Object {
      "addedNodes": Array [],
      "attributeName": "id",
      "attributeNamespace": null,
      "nextSibling": null,
      "oldValue": null,
      "previousSibling": null,
      "removedNodes": Array [],
      "target": <div
        id="foo"
      />,
      "type": "attributes",
    },
  ]
  `)
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

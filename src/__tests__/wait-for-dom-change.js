import {waitForDomChange} from '../wait-for-dom-change'
import {renderIntoDocument} from './helpers/test-utils'

function importModule() {
  jest.resetModules()
  return require('../').waitForDomChange
}

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

test('always uses real timers', async () => {
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

  jest.useFakeTimers()
  await expectElementToChange()
  jest.useRealTimers()
  await expectElementToChange()
})

test("doesn't change jest's timers value when importing the module", () => {
  jest.useFakeTimers()
  importModule()

  expect(window.setTimeout._isMockFunction).toEqual(true)
})

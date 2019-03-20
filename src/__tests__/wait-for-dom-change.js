import {waitForDomChange} from '../wait-for-dom-change'
import {renderIntoDocument, cleanup} from './helpers/test-utils'

afterEach(cleanup)

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

test('can time out', async () => {
  jest.useFakeTimers()
  const promise = waitForDomChange()
  jest.advanceTimersByTime(4600)
  await expect(promise).rejects.toThrow(/timed out/i)
  jest.useRealTimers()
})

test('can specify our own timeout time', async () => {
  jest.useFakeTimers()
  const promise = waitForDomChange({timeout: 4700})
  const handler = jest.fn()
  promise.then(handler, handler)
  // advance beyond the default
  jest.advanceTimersByTime(4600)
  // promise was neither rejected nor resolved
  expect(handler).toHaveBeenCalledTimes(0)

  // advance beyond our specified timeout
  jest.advanceTimersByTime(150)

  // timed out
  await expect(promise).rejects.toThrow(/timed out/i)
  jest.useRealTimers()
})

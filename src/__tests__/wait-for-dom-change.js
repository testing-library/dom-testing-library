import {waitForDomChange} from '..'
import {renderIntoDocument} from './helpers/test-utils'

afterEach(() => {
  jest.useRealTimers()
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

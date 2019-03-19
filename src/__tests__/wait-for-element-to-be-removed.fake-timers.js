import {waitForElementToBeRemoved} from '../'
import {render} from './helpers/test-utils'

jest.useFakeTimers()

test('requires a function as the first parameter', () => {
  return expect(
    waitForElementToBeRemoved(),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"waitForElementToBeRemoved requires a function as the first parameter"`,
  )
})

test('requires an element to exist first', () => {
  return expect(
    waitForElementToBeRemoved(() => null),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"The callback function which was passed did not return an element or non-empty array of elements. waitForElementToBeRemoved requires that the element(s) exist before waiting for removal."`,
  )
})

test('requires an unempty array of elements to exist first', () => {
  return expect(
    waitForElementToBeRemoved(() => []),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"The callback function which was passed did not return an element or non-empty array of elements. waitForElementToBeRemoved requires that the element(s) exist before waiting for removal."`,
  )
})

test('times out after 4500ms by default', () => {
  const {container} = render(`<div></div>`)
  const promise = expect(
    waitForElementToBeRemoved(() => container),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"Timed out in waitForElementToBeRemoved."`,
  )
  jest.advanceTimersByTime(4501)
  return promise
})

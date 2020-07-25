import {fuzzyMatches, matches} from '../matches'

// unit tests for text match utils

const node = null
const normalizer = str => str

test('matchers accept strings', () => {
  expect(matches('ABC', node, 'ABC', normalizer)).toBe(true)
  expect(fuzzyMatches('ABC', node, 'ABC', normalizer)).toBe(true)
})

test('matchers accept regex', () => {
  expect(matches('ABC', node, /ABC/, normalizer)).toBe(true)
  expect(fuzzyMatches('ABC', node, /ABC/, normalizer)).toBe(true)
})

test('matchers accept functions', () => {
  expect(matches('ABC', node, text => text === 'ABC', normalizer)).toBe(true)
  expect(fuzzyMatches('ABC', node, text => text === 'ABC', normalizer)).toBe(
    true,
  )
})

test('matchers return false if text to match is not a string', () => {
  expect(matches(null, node, 'ABC', normalizer)).toBe(false)
  expect(fuzzyMatches(null, node, 'ABC', normalizer)).toBe(false)
})

test('matchers throw on invalid matcher inputs', () => {
  expect(() =>
    matches('ABC', node, null, normalizer),
  ).toThrowErrorMatchingInlineSnapshot(
    `"It looks like null was passed instead of a matcher. Did you do something like getByText(null)?"`,
  )
  expect(() =>
    fuzzyMatches('ABC', node, undefined, normalizer),
  ).toThrowErrorMatchingInlineSnapshot(
    `"It looks like undefined was passed instead of a matcher. Did you do something like getByText(undefined)?"`,
  )
})

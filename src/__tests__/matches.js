import {fuzzyMatches, matches} from '../'

// unit tests for text match utils

const node = null

test('matchers accept strings', () => {
  expect(matches('ABC', node, 'ABC')).toBe(true)
  expect(fuzzyMatches('ABC', node, 'ABC')).toBe(true)
})

test('matchers accept regex', () => {
  expect(matches('ABC', node, /ABC/)).toBe(true)
  expect(fuzzyMatches('ABC', node, /ABC/)).toBe(true)
})

test('matchers accept functions', () => {
  expect(matches('ABC', node, text => text === 'ABC')).toBe(true)
  expect(fuzzyMatches('ABC', node, text => text === 'ABC')).toBe(true)
})

test('matchers return false if text to match is not a string', () => {
  expect(matches(null, node, 'ABC')).toBe(false)
  expect(fuzzyMatches(null, node, 'ABC')).toBe(false)
})

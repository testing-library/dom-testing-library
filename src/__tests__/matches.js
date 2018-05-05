import {fuzzyMatches, matches} from '../'

// unit tests for text match utils

const node = null

test('matches should get fuzzy matches', () => {
  // should not match
  expect(matches(null, node, 'abc')).toBe(false)
  expect(matches('', node, 'abc')).toBe(false)
  // should match
  expect(fuzzyMatches('ABC', node, 'abc')).toBe(true)
  expect(fuzzyMatches('ABC', node, 'ABC')).toBe(true)
})

test('matchesExact should only get exact matches', () => {
  // should not match
  expect(matches(null, node, null)).toBe(false)
  expect(matches(null, node, 'abc')).toBe(false)
  expect(matches('', node, 'abc')).toBe(false)
  expect(matches('ABC', node, 'abc')).toBe(false)
  expect(matches('ABC', node, 'A')).toBe(false)
  expect(matches('ABC', node, 'ABCD')).toBe(false)
  // should match
  expect(matches('ABC', node, 'ABC')).toBe(true)
})

test('matchers should collapse whitespace if requested', () => {
  // should match
  expect(matches('ABC\n \t', node, 'ABC', true)).toBe(true)
  expect(matches('ABC\n \t', node, 'ABC', false)).toBe(false)
  expect(fuzzyMatches('ABC\n \t', node, 'ABC', true)).toBe(true)
  expect(fuzzyMatches(' ABC\n \t ', node, 'ABC', false)).toBe(true)
  expect(fuzzyMatches(' ABC\n \t ', node, /^ABC/, true)).toBe(true)
  expect(fuzzyMatches(' ABC\n \t ', node, /^ABC/, false)).toBe(false)
})

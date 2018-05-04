import {matches, matchesExact} from '../'

// unit tests for text match utils

const node = null

test('matches should get fuzzy matches', () => {
  // should not match
  expect(matchesExact(null, node, 'abc')).toBe(false)
  expect(matchesExact('', node, 'abc')).toBe(false)
  // should match
  expect(matches('ABC', node, 'abc')).toBe(true)
  expect(matches('ABC', node, 'ABC')).toBe(true)
})

test('matchesExact should only get exact matches', () => {
  // should not match
  expect(matchesExact(null, node, null)).toBe(false)
  expect(matchesExact(null, node, 'abc')).toBe(false)
  expect(matchesExact('', node, 'abc')).toBe(false)
  expect(matchesExact('ABC', node, 'abc')).toBe(false)
  expect(matchesExact('ABC', node, 'A')).toBe(false)
  expect(matchesExact('ABC', node, 'ABCD')).toBe(false)
  // should match
  expect(matchesExact('ABC', node, 'ABC')).toBe(true)
})

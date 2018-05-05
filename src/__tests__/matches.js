import {fuzzyMatches, matches} from '../'

// unit tests for text match utils

const node = null

test('matches should accept regex', () => {
  expect(matches('ABC', node, /ABC/)).toBe(true)
  expect(fuzzyMatches('ABC', node, /ABC/)).toBe(true)
})

test('matches should accept functions', () => {
  expect(matches('ABC', node, text => text === 'ABC')).toBe(true)
  expect(fuzzyMatches('ABC', node, text => text === 'ABC')).toBe(true)
})

test('fuzzyMatches should get fuzzy matches', () => {
  // should not match
  expect(fuzzyMatches(null, node, 'abc')).toBe(false)
  expect(fuzzyMatches('', node, 'abc')).toBe(false)
  expect(fuzzyMatches('ABC', node, 'ABCD')).toBe(false)
  // should match
  expect(fuzzyMatches('AB C', node, 'ab c')).toBe(true)
  expect(fuzzyMatches('AB C', node, 'AB C')).toBe(true)
  expect(fuzzyMatches('ABC', node, 'A')).toBe(true)
  expect(fuzzyMatches('\nAB C\t', node, 'AB C')).toBe(true)
  expect(fuzzyMatches('\nAB\nC\t', node, 'AB C')).toBe(true)
})

test('matches should only get exact matches', () => {
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

test('should trim strings of surrounding whitespace by default', () => {
  expect(matches(' ABC ', node, /^ABC/)).toBe(true)
  expect(fuzzyMatches(' ABC ', node, /^ABC/)).toBe(true)
})

test('collapseWhitespace option should be toggleable', () => {
  const yes = {
    collapseWhitespace: true,
  }
  const no = {
    collapseWhitespace: false,
  }

  expect(matches('AB\n \t C', node, 'ABC')).toBe(false) // default
  expect(fuzzyMatches('AB\n \t C', node, 'AB C')).toBe(true) // default

  expect(matches('AB\n \t C', node, 'AB C', yes)).toBe(true)
  expect(fuzzyMatches('AB\n \t C', node, 'AB C', yes)).toBe(true)

  expect(matches('AB\n \t C', node, 'AB C', no)).toBe(false)
  expect(fuzzyMatches('AB\n \t C', node, 'AB C', no)).toBe(false)
})

test('trim option should be toggleable', () => {
  const yes = {
    trim: true,
  }
  const no = {
    trim: false,
  }

  expect(matches(' ABC \n\t', node, /^ABC$/)).toBe(true) // default
  expect(fuzzyMatches(' ABC \n\t', node, /^ABC$/)).toBe(true) // default

  expect(matches(' ABC \n\t', node, /^ABC$/, yes)).toBe(true)
  expect(fuzzyMatches(' ABC \n\t', node, /^ABC$/, yes)).toBe(true)

  expect(matches(' ABC \n\t', node, /^ABC$/, no)).toBe(false)
  expect(fuzzyMatches(' ABC \n\t', node, /^ABC$/, no)).toBe(false)
})

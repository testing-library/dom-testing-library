import {
  calculateLevenshteinDistance,
  getCloseMatchesByAttribute,
} from '../close-matches'
import {render} from './helpers/test-utils'

describe('calculateLevenshteinDistance', () => {
  test.each([
    ['', '', 0],
    ['hello', 'hello', 0],
    ['greeting', 'greeting', 0],
    ['react testing library', 'react testing library', 0],
    ['hello', 'hellow', 1],
    ['greetimg', 'greeting', 1],
    ['submit', 'sbmit', 1],
    ['cance', 'cancel', 1],
    ['doug', 'dog', 1],
    ['dogs and cats', 'dogs and cat', 1],
    ['uncool-div', '12cool-div', 2],
    ['dogs and cats', 'dogs, cats', 4],
    ['greeting', 'greetings traveler', 10],
    ['react testing library', '', 21],
    ['react testing library', 'y', 20],
    ['react testing library', 'ty', 19],
    ['react testing library', 'tary', 17],
    ['react testing library', 'trary', 16],
    ['react testing library', 'tlibrary', 13],
    ['react testing library', 'react testing', 8],
    ['library', 'testing', 7],
    ['react library', 'react testing', 7],
    [
      'The more your tests resemble the way your software is used, the more confidence they can give you.',
      'The less your tests resemble the way your software is used, the less confidence they can give you.',
      8,
    ],
  ])('distance between "%s" and "%s" is %i', (text1, text2, expected) => {
    expect(calculateLevenshteinDistance(text1, text2)).toBe(expected)
  })
})

describe('getCloseMatchesByAttribute', () => {
  test('should return all closest matches', () => {
    const {container} = render(`
    <div data-testid="The slow brown fox jumps over the lazy dog"></div>
    <div data-testid="The rapid brown fox jumps over the lazy dog"></div>
    <div data-testid="The quick black fox jumps over the lazy dog"></div>
    <div data-testid="The quick brown meerkat jumps over the lazy dog"></div>
    <div data-testid="The quick brown fox flies over the lazy dog"></div>
    `)
    expect(
      getCloseMatchesByAttribute(
        'data-testid',
        container,
        'The quick brown fox jumps over the lazy dog',
      ),
    ).toEqual([
      'The quick black fox jumps over the lazy dog',
      'The quick brown fox flies over the lazy dog',
    ])
  })

  test('should ignore matches that are too distant', () => {
    const {container} = render(`
      <div data-testid="very-cool-div"></div>
      <div data-testid="too-diferent-to-match"></div>
      <div data-testid="not-even-close"></div>
    `)
    expect(
      getCloseMatchesByAttribute('data-testid', container, 'normal-div'),
    ).toEqual([])
  })

  test('should ignore duplicated matches', () => {
    const {container} = render(`
      <div data-testid="lazy dog"></div>
      <div data-testid="lazy dog"></div>
      <div data-testid="lazy dog"></div>
      <div data-testid="energetic dog"></div>
    `)
    expect(
      getCloseMatchesByAttribute('data-testid', container, 'happy dog'),
    ).toEqual(['lazy dog'])
  })
})

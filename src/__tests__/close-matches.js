import {getCloseMatchesByAttribute} from '../close-matches'
import {render} from './helpers/test-utils'

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
      <div data-testid></div>
      <div></div>
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

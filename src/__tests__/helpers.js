import {getDocument} from '../helpers'

test('returns global document if exists', () => {
  expect(getDocument()).toBe(document)
})

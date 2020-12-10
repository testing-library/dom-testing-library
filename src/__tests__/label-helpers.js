import {getRealLabels} from '../label-helpers.ts'

test('hidden inputs are not labelable', () => {
  const element = document.createElement('input')
  element.type = 'hidden'
  expect(getRealLabels(element)).toEqual([])
})

import {getRealLabels} from '../label-helpers'

test('hidden inputs are not labelable', () => {
  const element = document.createElement('input')
  element.type = 'hidden'
  expect(getRealLabels(element)).toEqual([])
})

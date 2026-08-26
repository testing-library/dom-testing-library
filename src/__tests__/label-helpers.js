import {getRealLabels} from '../label-helpers'

test('hidden inputs are not labelable', () => {
  const element = document.createElement('input')
  element.type = 'hidden'
  expect(getRealLabels(element)).toEqual([])
})

test('form-associated custom elements are labelable', () => {
  const element = document.createElement('my-input')
  element.formAssociated = true
  expect(getRealLabels(element)).toEqual([])
})

test('custom elements without formAssociated are not labelable', () => {
  const element = document.createElement('my-input')
  expect(getRealLabels(element)).toEqual([])
})

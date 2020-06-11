import userEvent from '..'
import {addListeners, setupSelect, setup} from './helpers/utils'

test('should fire the correct events for multiple select', () => {
  const {form, select, getEventCalls} = setupSelect({multiple: true})

  userEvent.toggleSelectOptions(select, '1')

  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: select[name="select"][value=["1"]]

    mouseover: Left (0)
    mousemove: Left (0)
    mousedown: Left (0)
    focus
    mouseup: Left (0)
    click: Left (0)
    mouseover: Left (0) (bubbled from option[value="1"])
    mousemove: Left (0) (bubbled from option[value="1"])
    mousedown: Left (0) (bubbled from option[value="1"])
    mouseup: Left (0) (bubbled from option[value="1"])
    click: Left (0) (bubbled from option[value="1"])
    change
  `)

  expect(form).toHaveFormValues({select: ['1']})
})

test('should fire the correct events for multiple select when focus is in other element', () => {
  const {select} = setupSelect({multiple: true})
  const button = document.createElement('button')
  document.body.append(button)

  const {getEventCalls: getSelectEventCalls} = addListeners(select)
  const {getEventCalls: getButtonEventCalls} = addListeners(button)

  button.focus()

  userEvent.toggleSelectOptions(select, '1')

  expect(getButtonEventCalls()).toMatchInlineSnapshot(`
    Events fired on: button

    focus
    mousemove: Left (0)
    mouseleave: Left (0)
    blur
  `)
  expect(getSelectEventCalls()).toMatchInlineSnapshot(`
    Events fired on: select[name="select"][value=["1"]]

    mouseover: Left (0)
    mousemove: Left (0)
    mousedown: Left (0)
    focus
    mouseup: Left (0)
    click: Left (0)
    mouseover: Left (0) (bubbled from option[value="1"])
    mousemove: Left (0) (bubbled from option[value="1"])
    mousedown: Left (0) (bubbled from option[value="1"])
    mouseup: Left (0) (bubbled from option[value="1"])
    click: Left (0) (bubbled from option[value="1"])
    change
  `)
})

test('toggle options as expected', () => {
  const {element} = setup(`
    <form>
      <select name="select" multiple>
        <option value="1">One</option>
        <optgroup label="Group Name">
          <option value="2">Two</option>
          <option value="3">Three</option>
        </optgroup>
      </select>
    </form>
  `)

  const select = element.querySelector('select')

  // select one
  userEvent.toggleSelectOptions(select, ['1'])
  expect(element).toHaveFormValues({select: ['1']})

  // unselect one and select two
  userEvent.toggleSelectOptions(select, ['1', '2'])
  expect(element).toHaveFormValues({select: ['2']})

  // // select one
  userEvent.toggleSelectOptions(select, ['1'])
  expect(element).toHaveFormValues({select: ['1', '2']})
})

it('throws error when provided element is not a multiple select', () => {
  const {element} = setup(`<select />`)

  expect(() => {
    userEvent.toggleSelectOptions(element)
  }).toThrowErrorMatchingInlineSnapshot(
    `Unable to toggleSelectOptions - please provide a select element with multiple=true`,
  )
})

import * as userEvent from '..'
import {addListeners, setupSelect, setup} from './helpers/utils'

test('should fire the correct events for multiple select', async () => {
  const {form, select, getEventCalls} = setupSelect({multiple: true})

  await userEvent.toggleSelectOptions(select, '1')

  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: select[name="select"][value=["1"]]

    mouseover: Left (0)
    mousemove: Left (0)
    mousedown: Left (0)
    focus
    focusin
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

test('should fire the correct events for multiple select when focus is in other element', async () => {
  const {form, select} = setupSelect({multiple: true})
  const button = document.createElement('button')
  form.append(button)

  const {getEventCalls, clearEventCalls} = addListeners(form)
  button.focus()

  clearEventCalls()
  await userEvent.toggleSelectOptions(select, '1')

  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: form

    mouseover: Left (0) (bubbled from select[name="select"][value=[]])
    mousemove: Left (0) (bubbled from select[name="select"][value=[]])
    mousedown: Left (0) (bubbled from select[name="select"][value=[]])
    focusout (bubbled from button)
    focusin (bubbled from select[name="select"][value=[]])
    mouseup: Left (0) (bubbled from select[name="select"][value=[]])
    click: Left (0) (bubbled from select[name="select"][value=[]])
    mouseover: Left (0) (bubbled from option[value="1"])
    mousemove: Left (0) (bubbled from option[value="1"])
    mousedown: Left (0) (bubbled from option[value="1"])
    mouseup: Left (0) (bubbled from option[value="1"])
    click: Left (0) (bubbled from option[value="1"])
    change (bubbled from select[name="select"][value=["1"]])
  `)
})

test('toggle options as expected', async () => {
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
  await userEvent.toggleSelectOptions(select, ['1'])
  expect(element).toHaveFormValues({select: ['1']})

  // unselect one and select two
  await userEvent.toggleSelectOptions(select, ['1', '2'])
  expect(element).toHaveFormValues({select: ['2']})

  // // select one
  await userEvent.toggleSelectOptions(select, ['1'])
  expect(element).toHaveFormValues({select: ['1', '2']})
})

test('sets the selected prop on the selected option using option html elements', async () => {
  const {select, options} = setupSelect({multiple: true})
  const [o1, o2, o3] = options
  await userEvent.toggleSelectOptions(select, [o3, o2])
  expect(o1.selected).toBe(false)
  expect(o2.selected).toBe(true)
  expect(o3.selected).toBe(true)
})

test('throws error when provided element is not a multiple select', async () => {
  const {element} = setup(`<select />`)

  const error = await userEvent.toggleSelectOptions(element).catch(e => e)
  expect(error.message).toMatch(/must be a multiple select/i)
})

test('throws an error one selected option does not match', async () => {
  const {select} = setupSelect({multiple: true})
  const error = await userEvent
    .toggleSelectOptions(select, ['3', 'Matches nothing'])
    .catch(e => e)
  expect(error.message).toMatch(/not found/i)
})

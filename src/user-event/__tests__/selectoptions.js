import userEvent from '..'
import {setupSelect} from './helpers/utils'

test('fires correct events', () => {
  const {select, options, getEventCalls} = setupSelect()
  userEvent.selectOptions(select, '1')
  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: select[name="select"][value="1"]

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
  const [o1, o2, o3] = options
  expect(o1.selected).toBe(true)
  expect(o2.selected).toBe(false)
  expect(o3.selected).toBe(false)
})

test('fires correct events on multi-selects', () => {
  const {select, options, getEventCalls} = setupSelect({multiple: true})
  userEvent.selectOptions(select, ['1', '3'])
  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: select[name="select"][value=["1","3"]]

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
    mouseover: Left (0) (bubbled from option[value="3"])
    mousemove: Left (0) (bubbled from option[value="3"])
    mousedown: Left (0) (bubbled from option[value="3"])
    mouseup: Left (0) (bubbled from option[value="3"])
    click: Left (0) (bubbled from option[value="3"])
    change
  `)
  const [o1, o2, o3] = options
  expect(o1.selected).toBe(true)
  expect(o2.selected).toBe(false)
  expect(o3.selected).toBe(true)
})

test('sets the selected prop on the selected OPTION using nodes', () => {
  const {select, options} = setupSelect()
  const [o1, o2, o3] = options
  userEvent.selectOptions(select, o1)
  expect(o1.selected).toBe(true)
  expect(o2.selected).toBe(false)
  expect(o3.selected).toBe(false)
})

// TODO: throw an error instead
test('does not select anything if no matching options are given', () => {
  const {select, options} = setupSelect()
  const [o1, o2, o3] = options
  expect(o1.selected).toBe(true) // NOTE: by default the first option is selected
  userEvent.selectOptions(select, 'Matches nothing')
  expect(select.selectedIndex).toBe(0)
  expect(o1.selected).toBe(true) // unchanged
  expect(o2.selected).toBe(false)
  expect(o3.selected).toBe(false)
})

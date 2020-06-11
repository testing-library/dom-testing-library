import userEvent from '..'
import {setup, addEventListener, addListeners} from './helpers/utils'

test('click in input', () => {
  const {element, getEventCalls} = setup('<input />')
  userEvent.click(element)
  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: input[value=""]

    mouseover: Left (0)
    mousemove: Left (0)
    mousedown: Left (0)
    focus
    mouseup: Left (0)
    click: Left (0)
  `)
})

test('click in textarea', () => {
  const {element, getEventCalls} = setup('<textarea></textarea>')
  userEvent.click(element)
  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: textarea[value=""]

    mouseover: Left (0)
    mousemove: Left (0)
    mousedown: Left (0)
    focus
    mouseup: Left (0)
    click: Left (0)
  `)
})

test('should fire the correct events for <input type="checkbox">', () => {
  const {element, getEventCalls} = setup('<input type="checkbox" />')
  expect(element).not.toBeChecked()
  userEvent.click(element)
  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: input[checked=true]

    mouseover: Left (0)
    mousemove: Left (0)
    mousedown: Left (0)
    focus
    mouseup: Left (0)
    click: unchecked -> checked
    input: checked
    change
  `)
})

test('should fire the correct events for <input type="checkbox" disabled>', () => {
  const {element, getEventCalls} = setup('<input type="checkbox" disabled />')
  userEvent.click(element)
  expect(element).toBeDisabled()
  // no event calls is expected here:
  expect(getEventCalls()).toMatchInlineSnapshot(
    `No events were fired on: input[checked=false]`,
  )
  expect(element).toBeDisabled()
  expect(element).toHaveProperty('checked', false)
})

test('should fire the correct events for <input type="radio">', () => {
  const {element, getEventCalls} = setup('<input type="radio" />')
  expect(element).not.toBeChecked()
  userEvent.click(element)
  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: input[checked=true]

    mouseover: Left (0)
    mousemove: Left (0)
    mousedown: Left (0)
    focus
    mouseup: Left (0)
    click: unchecked -> checked
    input: checked
    change
  `)

  expect(element).toHaveProperty('checked', true)
})

test('should fire the correct events for <input type="radio" disabled>', () => {
  const {element, getEventCalls} = setup('<input type="radio" disabled />')
  userEvent.click(element)
  expect(element).toBeDisabled()
  // no event calls is expected here:
  expect(getEventCalls()).toMatchInlineSnapshot(
    `No events were fired on: input[checked=false]`,
  )
  expect(element).toBeDisabled()

  expect(element).toHaveProperty('checked', false)
})

test('should fire the correct events for <div>', () => {
  const {element, getEventCalls} = setup('<div></div>')
  userEvent.click(element)
  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: div

    mouseover: Left (0)
    mousemove: Left (0)
    mousedown: Left (0)
    mouseup: Left (0)
    click: Left (0)
  `)
})

test('toggles the focus', () => {
  const {element} = setup(`<div><input /><input /></div>`)

  const a = element.children[0]
  const b = element.children[1]

  expect(a).not.toHaveFocus()
  expect(b).not.toHaveFocus()

  userEvent.click(a)
  expect(a).toHaveFocus()
  expect(b).not.toHaveFocus()

  userEvent.click(b)
  expect(a).not.toHaveFocus()
  expect(b).toHaveFocus()
})

test('should blur the previous element', () => {
  const {element} = setup(`<div><input /><input /></div>`)

  const a = element.children[0]
  const b = element.children[1]

  const {getEventCalls, clearEventCalls} = addListeners(a)

  userEvent.click(a)
  clearEventCalls()
  userEvent.click(b)
  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: input[value=""]

    mousemove: Left (0) (bubbled from input[value=""])
    mouseleave: Left (0)
    blur
  `)
})

test('should not blur the previous element when mousedown prevents default', () => {
  const {element} = setup(`<div><input /><input /></div>`)

  const a = element.children[0]
  const b = element.children[1]

  addEventListener(b, 'mousedown', e => e.preventDefault())

  const {getEventCalls, clearEventCalls} = addListeners(a)

  userEvent.click(a)
  clearEventCalls()
  userEvent.click(b)
  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: input[value=""]

    mousemove: Left (0) (bubbled from input[value=""])
    mouseleave: Left (0)
  `)
})

test('does not lose focus when click updates focus', () => {
  const {element} = setup(`<div><input /><button>focus</button></div>`)
  const input = element.children[0]
  const button = element.children[1]

  addEventListener(button, 'click', () => input.focus())

  expect(input).not.toHaveFocus()

  userEvent.click(button)
  expect(input).toHaveFocus()

  userEvent.click(button)
  expect(input).toHaveFocus()
})

test('gives focus to the form control when clicking the label', () => {
  const {element} = setup(`
    <div>
      <label for="input">label</label>
      <input id="input" />
    </div>
  `)
  const label = element.children[0]
  const input = element.children[1]

  userEvent.click(label)
  expect(input).toHaveFocus()
})

test('gives focus to the form control when clicking within a label', () => {
  const {element} = setup(`
    <div>
      <label for="input"><span>label</span></label>
      <input id="input" />
    </div>
  `)
  const label = element.children[0]
  const span = label.firstChild
  const input = element.children[1]

  userEvent.click(span)
  expect(input).toHaveFocus()
})

test('clicking a label checks the checkbox', () => {
  const {element} = setup(`
    <div>
      <label for="input">label</label>
      <input id="input" type="checkbox" />
    </div>
  `)
  const label = element.children[0]
  const input = element.children[1]

  userEvent.click(label)
  expect(input).toHaveFocus()
  expect(input).toBeChecked()
})

test('clicking a label checks the radio', () => {
  const {element} = setup(`
    <div>
      <label for="input">label</label>
      <input id="input" name="radio" type="radio" />
    </div>
  `)
  const label = element.children[0]
  const input = element.children[1]

  userEvent.click(label)
  expect(input).toHaveFocus()
  expect(input).toBeChecked()
})

test('submits a form when clicking on a <button>', () => {
  const {element, getEventCalls} = setup(`<form><button>Submit</button></form>`)
  userEvent.click(element.children[0])
  expect(getEventCalls()).toContain('submit')
})

test('does not submit a form when clicking on a <button type="button">', () => {
  const {element, getEventCalls} = setup(`
    <form>
      <button type="button">Submit</button>
    </form>
  `)
  userEvent.click(element.children[0])
  expect(getEventCalls()).not.toContain('submit')
})

test('does not fire blur on current element if is the same as previous', () => {
  const {element, getEventCalls, clearEventCalls} = setup('<button />')

  userEvent.click(element)
  expect(getEventCalls()).not.toContain('blur')

  clearEventCalls()

  userEvent.click(element)
  expect(getEventCalls()).not.toContain('blur')
})

test('does not give focus when mouseDown is prevented', () => {
  const {element} = setup('<input />', {
    eventHandlers: {mouseDown: e => e.preventDefault()},
  })
  userEvent.click(element)
  expect(element).not.toHaveFocus()
})

test('fires mouse events with the correct properties', () => {
  const {element, getEvents} = setup('<div></div>')
  userEvent.click(element)
  expect(getEvents()).toEqual([
    expect.objectContaining({
      type: 'mouseover',
      button: 0,
      buttons: 0,
      detail: 0,
    }),
    expect.objectContaining({
      type: 'mousemove',
      button: 0,
      buttons: 0,
      detail: 0,
    }),
    expect.objectContaining({
      type: 'mousedown',
      button: 0,
      buttons: 1,
      detail: 1,
    }),
    expect.objectContaining({
      type: 'mouseup',
      button: 0,
      buttons: 1,
      detail: 1,
    }),
    expect.objectContaining({
      type: 'click',
      button: 0,
      buttons: 1,
      detail: 1,
    }),
  ])
})

test('fires mouse events with custom button property', () => {
  const {element, getEvents} = setup('<div></div>')
  userEvent.click(element, {
    button: 1,
    altKey: true,
  })
  expect(getEvents()).toEqual([
    expect.objectContaining({
      type: 'mouseover',
      button: 0,
      buttons: 0,
      detail: 0,
      altKey: true,
    }),
    expect.objectContaining({
      type: 'mousemove',
      button: 0,
      buttons: 0,
      detail: 0,
      altKey: true,
    }),
    expect.objectContaining({
      type: 'mousedown',
      button: 1,
      buttons: 4,
      detail: 1,
      altKey: true,
    }),
    expect.objectContaining({
      type: 'mouseup',
      button: 1,
      buttons: 4,
      detail: 1,
      altKey: true,
    }),
    expect.objectContaining({
      type: 'click',
      button: 1,
      buttons: 4,
      detail: 1,
      altKey: true,
    }),
  ])
})

test('fires mouse events with custom buttons property', () => {
  const {element, getEvents} = setup('<div></div>')

  userEvent.click(element, {buttons: 4})

  expect(getEvents()).toEqual([
    expect.objectContaining({
      type: 'mouseover',
      button: 0,
      buttons: 0,
      detail: 0,
    }),
    expect.objectContaining({
      type: 'mousemove',
      button: 0,
      buttons: 0,
      detail: 0,
    }),
    expect.objectContaining({
      type: 'mousedown',
      button: 1,
      buttons: 4,
      detail: 1,
    }),
    expect.objectContaining({
      type: 'mouseup',
      button: 1,
      buttons: 4,
      detail: 1,
    }),
    expect.objectContaining({
      type: 'click',
      button: 1,
      buttons: 4,
      detail: 1,
    }),
  ])
})

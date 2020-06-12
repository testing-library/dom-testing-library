import * as userEvent from '..'
import {setup, addEventListener, addListeners} from './helpers/utils'

test('fires the correct events on buttons', async () => {
  const {element, getEventSnapshot} = setup('<button />')
  await userEvent.dblClick(element)
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: button

    button - mouseover: Left (0)
    button - mousemove: Left (0)
    button - mousedown: Left (0)
    button - focus
    button - mouseup: Left (0)
    button - click: Left (0)
    button - mousedown: Left (0)
    button - mouseup: Left (0)
    button - click: Left (0)
    button - dblclick: Left (0)
  `)
})

test('fires the correct events on checkboxes', async () => {
  const {element, getEventSnapshot} = setup('<input type="checkbox" />')
  await userEvent.dblClick(element)
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[checked=false]

    input[checked=false] - mouseover: Left (0)
    input[checked=false] - mousemove: Left (0)
    input[checked=false] - mousedown: Left (0)
    input[checked=false] - focus
    input[checked=false] - mouseup: Left (0)
    input[checked=false] - click: Left (0)
      unchecked -> checked
    input[checked=false] - input
      unchecked -> checked
    input[checked=false] - change
      unchecked -> checked
    input[checked=true] - mousedown: Left (0)
    input[checked=true] - mouseup: Left (0)
    input[checked=true] - click: Left (0)
      checked -> unchecked
    input[checked=true] - input
      checked -> unchecked
    input[checked=true] - change
      checked -> unchecked
  `)
})

test('fires the correct events on regular inputs', async () => {
  const {element, getEventSnapshot} = setup('<input />')
  await userEvent.dblClick(element)
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value=""]

    input[value=""] - mouseover: Left (0)
    input[value=""] - mousemove: Left (0)
    input[value=""] - mousedown: Left (0)
    input[value=""] - focus
    input[value=""] - mouseup: Left (0)
    input[value=""] - click: Left (0)
    input[value=""] - mousedown: Left (0)
    input[value=""] - mouseup: Left (0)
    input[value=""] - click: Left (0)
    input[value=""] - dblclick: Left (0)
  `)
})

test('fires the correct events on divs', async () => {
  const {element, getEventSnapshot} = setup('<div></div>')
  await userEvent.dblClick(element)
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: div

    div - mouseover: Left (0)
    div - mousemove: Left (0)
    div - mousedown: Left (0)
    div - mouseup: Left (0)
    div - click: Left (0)
    div - mousedown: Left (0)
    div - mouseup: Left (0)
    div - click: Left (0)
    div - dblclick: Left (0)
  `)
})

test('blurs the previous element', async () => {
  const {element} = setup(`
    <div>
      <button id="button-a" />
      <button id="button-b" />
    </div>
  `)

  const a = element.children[0]
  const b = element.children[1]

  const {getEventSnapshot, clearEventCalls} = addListeners(a)

  await userEvent.dblClick(a)
  clearEventCalls()
  await userEvent.dblClick(b)
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: button#button-a

    button#button-a - mouseover: Left (0)
    button#button-a - mousemove: Left (0)
    button#button-a - mousedown: Left (0)
    button#button-a - focus
    button#button-a - mouseup: Left (0)
    button#button-a - click: Left (0)
    button#button-a - mousedown: Left (0)
    button#button-a - mouseup: Left (0)
    button#button-a - click: Left (0)
    button#button-a - dblclick: Left (0)
    button#button-a - blur
  `)
})

test('does not fire focus event if the element is already focused', async () => {
  const {element, clearEventCalls, eventWasFired} = setup(`<button />`)
  element.focus()
  clearEventCalls()
  await userEvent.dblClick(element)
  expect(eventWasFired('focus')).toBe(false)
})

test('clicking an element in a label gives the control focus', async () => {
  const {element, getEventSnapshot} = setup(`
    <div>
      <label for="nested-input">
        <span>nested</span>
      </label>
      <input id="nested-input" />
    </div>
  `)
  await userEvent.dblClick(element.querySelector('span'))
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: div

    span - mouseover: Left (0)
    span - mousemove: Left (0)
    span - mousedown: Left (0)
    span - mouseup: Left (0)
    span - click: Left (0)
    input#nested-input[value=""] - click: Left (0)
    span - mousedown: Left (0)
    span - mouseup: Left (0)
    span - click: Left (0)
    input#nested-input[value=""] - click: Left (0)
    span - dblclick: Left (0)
  `)
})

test('does not blur the previous element when mousedown prevents default', async () => {
  const {element} = setup(`
    <div>
      <button id="button-a" />
      <button id="button-b" />
    </div>
  `)

  const a = element.children[0]
  const b = element.children[1]

  addEventListener(b, 'mousedown', e => e.preventDefault())

  const {getEventSnapshot, clearEventCalls} = addListeners(a)

  await userEvent.dblClick(a)
  clearEventCalls()
  await userEvent.dblClick(b)
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: button#button-a

    button#button-a - mouseover: Left (0)
    button#button-a - mousemove: Left (0)
    button#button-a - mousedown: Left (0)
    button#button-a - focus
    button#button-a - mouseup: Left (0)
    button#button-a - click: Left (0)
    button#button-a - mousedown: Left (0)
    button#button-a - mouseup: Left (0)
    button#button-a - click: Left (0)
    button#button-a - dblclick: Left (0)
  `)
})

test('fires mouse events with the correct properties', async () => {
  const {element, getClickEventsSnapshot} = setup('<div></div>')
  await userEvent.dblClick(element)
  expect(getClickEventsSnapshot()).toMatchInlineSnapshot(`
    mouseover - button=0; buttons=0; detail=0
    mousemove - button=0; buttons=0; detail=0
    mousedown - button=0; buttons=1; detail=1
    mouseup - button=0; buttons=1; detail=1
    click - button=0; buttons=1; detail=1
    mousedown - button=0; buttons=1; detail=2
    mouseup - button=0; buttons=1; detail=2
    click - button=0; buttons=1; detail=2
    dblclick - button=0; buttons=1; detail=2
  `)
})

test('fires mouse events with custom button property', async () => {
  const {element, getClickEventsSnapshot} = setup('<div></div>')
  await userEvent.dblClick(element, {
    button: 1,
    altKey: true,
  })
  expect(getClickEventsSnapshot()).toMatchInlineSnapshot(`
    mouseover - button=0; buttons=0; detail=0
    mousemove - button=0; buttons=0; detail=0
    mousedown - button=1; buttons=4; detail=1
    mouseup - button=1; buttons=4; detail=1
    click - button=1; buttons=4; detail=1
    mousedown - button=1; buttons=4; detail=2
    mouseup - button=1; buttons=4; detail=2
    click - button=1; buttons=4; detail=2
    dblclick - button=1; buttons=4; detail=2
  `)
})

test('fires mouse events with custom buttons property', async () => {
  const {element, getClickEventsSnapshot} = setup('<div></div>')

  await userEvent.dblClick(element, {buttons: 4})

  expect(getClickEventsSnapshot()).toMatchInlineSnapshot(`
    mouseover - button=0; buttons=0; detail=0
    mousemove - button=0; buttons=0; detail=0
    mousedown - button=1; buttons=4; detail=1
    mouseup - button=1; buttons=4; detail=1
    click - button=1; buttons=4; detail=1
    mousedown - button=1; buttons=4; detail=2
    mouseup - button=1; buttons=4; detail=2
    click - button=1; buttons=4; detail=2
    dblclick - button=1; buttons=4; detail=2
  `)
})

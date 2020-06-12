import {userEvent} from '../../'
import {setup, addEventListener, addListeners} from './helpers/utils'

/*
button#button[value=""] pointerover
button#button[value=""] pointerenter
button#button[value=""] mouseover
button#button[value=""] mouseenter
button#button[value=""] pointermove
button#button[value=""] mousemove

button#button[value=""] pointerdown
button#button[value=""] mousedown
button#button[value=""] focus
button#button[value=""] focusin
button#button[value=""] pointerup
button#button[value=""] mouseup
button#button[value=""] click

button#button[value=""] pointerdown
button#button[value=""] mousedown
button#button[value=""] pointerup
button#button[value=""] mouseup
button#button[value=""] click
button#button[value=""] dblclick

*/
test('fires the correct events on buttons', async () => {
  const {element, getEventSnapshot} = setup('<button />')
  await userEvent.dblClick(element)
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: button

    button - pointerover
    button - pointerenter
    button - mouseover: Left (0)
    button - mouseenter: Left (0)
    button - pointermove
    button - mousemove: Left (0)
    button - mousedown: Left (0)
    button - focus
    button - focusin
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

    input[checked=false] - pointerover
    input[checked=false] - pointerenter
    input[checked=false] - mouseover: Left (0)
    input[checked=false] - mouseenter: Left (0)
    input[checked=false] - pointermove
    input[checked=false] - mousemove: Left (0)
    input[checked=false] - mouseover: Left (0)
    input[checked=false] - mousemove: Left (0)
    input[checked=false] - mousedown: Left (0)
    input[checked=false] - focus
    input[checked=false] - focusin
    input[checked=false] - mouseup: Left (0)
    input[checked=true] - click: Left (0)
      unchecked -> checked
    input[checked=true] - input
    input[checked=true] - change
    input[checked=true] - mousedown: Left (0)
    input[checked=true] - mouseup: Left (0)
    input[checked=false] - click: Left (0)
      checked -> unchecked
    input[checked=false] - input
    input[checked=false] - change
  `)
})

test('fires the correct events on regular inputs', async () => {
  const {element, getEventSnapshot} = setup('<input />')
  await userEvent.dblClick(element)
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value=""]

    input[value=""] - pointerover
    input[value=""] - pointerenter
    input[value=""] - mouseover: Left (0)
    input[value=""] - mouseenter: Left (0)
    input[value=""] - pointermove
    input[value=""] - mousemove: Left (0)
    input[value=""] - mousedown: Left (0)
    input[value=""] - focus
    input[value=""] - focusin
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

    div - pointerover
    div - pointerenter
    div - mouseover: Left (0)
    div - mouseenter: Left (0)
    div - pointermove
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

    button#button-a - blur
    button#button-a - focusout
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

    span - pointerover
    span - mouseover: Left (0)
    span - pointermove
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
  expect(getEventSnapshot()).toMatchInlineSnapshot(
    `No events were fired on: button#button-a`,
  )
})

test('fires mouse events with the correct properties', async () => {
  const {element, getClickEventsSnapshot} = setup('<div></div>')
  await userEvent.dblClick(element)
  expect(getClickEventsSnapshot()).toMatchInlineSnapshot(`
    pointerover
    pointerenter
    mouseover - button=0; buttons=0; detail=0
    mouseenter - button=0; buttons=0; detail=0
    pointermove
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
    pointerover
    pointerenter
    mouseover - button=0; buttons=0; detail=0
    mouseenter - button=0; buttons=0; detail=0
    pointermove
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
    pointerover
    pointerenter
    mouseover - button=0; buttons=0; detail=0
    mouseenter - button=0; buttons=0; detail=0
    pointermove
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

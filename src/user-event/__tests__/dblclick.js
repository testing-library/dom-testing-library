import * as userEvent from '..'
import {setup, addEventListener, addListeners} from './helpers/utils'

test('fires the correct events on buttons', async () => {
  const {element, getEventCalls} = setup('<button />')
  await userEvent.dblClick(element)
  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: button

    mouseover: Left (0)
    mousemove: Left (0)
    mousedown: Left (0)
    focus
    mouseup: Left (0)
    click: Left (0)
    mousedown: Left (0)
    mouseup: Left (0)
    click: Left (0)
    dblclick: Left (0)
  `)
})

test('fires the correct events on checkboxes', async () => {
  const {element, getEventCalls} = setup('<input type="checkbox" />')
  await userEvent.dblClick(element)
  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: input[checked=false]

    mouseover: Left (0)
    mousemove: Left (0)
    mousedown: Left (0)
    focus
    mouseup: Left (0)
    click: unchecked -> checked
    input: checked
    change
    mousedown: Left (0)
    mouseup: Left (0)
    click: checked -> unchecked
    input: unchecked
    change
  `)
})

test('fires the correct events on regular inputs', async () => {
  const {element, getEventCalls} = setup('<input />')
  await userEvent.dblClick(element)
  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: input[value=""]

    mouseover: Left (0)
    mousemove: Left (0)
    mousedown: Left (0)
    focus
    mouseup: Left (0)
    click: Left (0)
    mousedown: Left (0)
    mouseup: Left (0)
    click: Left (0)
    dblclick: Left (0)
  `)
})

test('fires the correct events on divs', async () => {
  const {element, getEventCalls} = setup('<div></div>')
  await userEvent.dblClick(element)
  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: div

    mouseover: Left (0)
    mousemove: Left (0)
    mousedown: Left (0)
    mouseup: Left (0)
    click: Left (0)
    mousedown: Left (0)
    mouseup: Left (0)
    click: Left (0)
    dblclick: Left (0)
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

  const {getEventCalls, clearEventCalls} = addListeners(a)

  await userEvent.dblClick(a)
  clearEventCalls()
  await userEvent.dblClick(b)
  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: button#button-a

    blur
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
  const {element, getEventCalls} = setup(`
    <div>
      <label for="nested-input">
        <span>nested</span>
      </label>
      <input id="nested-input" />
    </div>
  `)
  await userEvent.dblClick(element.querySelector('span'))
  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: div

    mouseover: Left (0) (bubbled from span)
    mousemove: Left (0) (bubbled from span)
    mousedown: Left (0) (bubbled from span)
    mouseup: Left (0) (bubbled from span)
    click: Left (0) (bubbled from span)
    click: Left (0) (bubbled from input#nested-input[value=""])
    mousedown: Left (0) (bubbled from span)
    mouseup: Left (0) (bubbled from span)
    click: Left (0) (bubbled from span)
    click: Left (0) (bubbled from input#nested-input[value=""])
    dblclick: Left (0) (bubbled from span)
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

  const {getEventCalls, clearEventCalls} = addListeners(a)

  await userEvent.dblClick(a)
  clearEventCalls()
  await userEvent.dblClick(b)
  expect(getEventCalls()).toMatchInlineSnapshot(
    `No events were fired on: button#button-a`,
  )
})

test('fires mouse events with the correct properties', async () => {
  const {element, getEvents} = setup('<div></div>')
  await userEvent.dblClick(element)
  const events = getEvents().map(
    ({constructor, type, button, buttons, detail}) =>
      constructor.name === 'MouseEvent'
        ? `${type} - button=${button}; buttons=${buttons}; detail=${detail}`
        : type,
  )
  expect(events.join('\n')).toMatchInlineSnapshot(`
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
  const {element, getEvents} = setup('<div></div>')
  await userEvent.dblClick(element, {
    button: 1,
    altKey: true,
  })
  const events = getEvents().map(
    ({constructor, type, button, buttons, detail}) =>
      constructor.name === 'MouseEvent'
        ? `${type} - button=${button}; buttons=${buttons}; detail=${detail}`
        : type,
  )
  expect(events.join('\n')).toMatchInlineSnapshot(`
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
  const {element, getEvents} = setup('<div></div>')

  await userEvent.dblClick(element, {buttons: 4})

  const events = getEvents().map(
    ({constructor, type, button, buttons, detail}) =>
      constructor.name === 'MouseEvent'
        ? `${type} - button=${button}; buttons=${buttons}; detail=${detail}`
        : type,
  )
  expect(events.join('\n')).toMatchInlineSnapshot(`
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

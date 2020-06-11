import userEvent from '..'
import {setup, addEventListener, addListeners} from './helpers/utils'

test('fires the correct events on buttons', () => {
  const {element, getEventCalls} = setup('<button />')
  userEvent.dblClick(element)
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

test('fires the correct events on checkboxes', () => {
  const {element, getEventCalls} = setup('<input type="checkbox" />')
  userEvent.dblClick(element)
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

test('fires the correct events on divs', () => {
  const {element, getEventCalls} = setup('<div></div>')
  userEvent.dblClick(element)
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

test('blurs the previous element', () => {
  const {element} = setup(`
    <div>
      <button id="button-a" />
      <button id="button-b" />
    </div>
  `)

  const a = element.children[0]
  const b = element.children[1]

  const {getEventCalls, clearEventCalls} = addListeners(a)

  userEvent.dblClick(a)
  clearEventCalls()
  userEvent.dblClick(b)
  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: button#button-a

    mousemove: Left (0) (bubbled from button#button-a)
    mouseleave: Left (0)
    blur
  `)
})

test('does not blur the previous element when mousedown prevents default', () => {
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

  userEvent.dblClick(a)
  clearEventCalls()
  userEvent.dblClick(b)
  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: button#button-a

    mousemove: Left (0) (bubbled from button#button-a)
    mouseleave: Left (0)
  `)
})

test('fires mouse events with the correct properties', () => {
  const {element, getEvents} = setup('<div></div>')
  userEvent.dblClick(element)
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
    expect.objectContaining({
      type: 'mousedown',
      button: 0,
      buttons: 1,
      detail: 2,
    }),
    expect.objectContaining({
      type: 'mouseup',
      button: 0,
      buttons: 1,
      detail: 2,
    }),
    expect.objectContaining({
      type: 'click',
      button: 0,
      buttons: 1,
      detail: 2,
    }),
    expect.objectContaining({
      type: 'dblclick',
      button: 0,
      buttons: 1,
      detail: 2,
    }),
  ])
})

test('fires mouse events with custom button property', () => {
  const {element, getEvents} = setup('<div></div>')
  userEvent.dblClick(element, {
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
    expect.objectContaining({
      type: 'mousedown',
      button: 1,
      buttons: 4,
      detail: 2,
      altKey: true,
    }),
    expect.objectContaining({
      type: 'mouseup',
      button: 1,
      buttons: 4,
      detail: 2,
      altKey: true,
    }),
    expect.objectContaining({
      type: 'click',
      button: 1,
      buttons: 4,
      detail: 2,
      altKey: true,
    }),
    expect.objectContaining({
      type: 'dblclick',
      button: 1,
      buttons: 4,
      detail: 2,
      altKey: true,
    }),
  ])
})

test('fires mouse events with custom buttons property', () => {
  const {element, getEvents} = setup('<div></div>')

  userEvent.dblClick(element, {buttons: 4})

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
    expect.objectContaining({
      type: 'mousedown',
      button: 1,
      buttons: 4,
      detail: 2,
    }),
    expect.objectContaining({
      type: 'mouseup',
      button: 1,
      buttons: 4,
      detail: 2,
    }),
    expect.objectContaining({
      type: 'click',
      button: 1,
      buttons: 4,
      detail: 2,
    }),
    expect.objectContaining({
      type: 'dblclick',
      button: 1,
      buttons: 4,
      detail: 2,
    }),
  ])
})

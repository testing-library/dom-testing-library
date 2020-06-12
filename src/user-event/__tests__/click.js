import {userEvent} from '../../'
import {setup, addEventListener, addListeners} from './helpers/utils'

test('click in button', async () => {
  const {element, getEventSnapshot} = setup('<button />')
  await userEvent.click(element)
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: button

    button - pointerover
    button - pointerenter
    button - mouseover: Left (0)
    button - mouseenter: Left (0)
    button - pointermove
    button - mousemove: Left (0)
    button - pointerdown
    button - mousedown: Left (0)
    button - focus
    button - focusin
    button - pointerup
    button - mouseup: Left (0)
    button - click: Left (0)
  `)
})

test('only fires pointer events when clicking a disabled button', async () => {
  const {element, getEventSnapshot} = setup('<button disabled />')
  await userEvent.click(element)
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: button

    button - pointerover
    button - pointerenter
    button - pointermove
    button - pointerdown
    button - pointerup
  `)
})

test('clicking a checkbox', async () => {
  const {element, getEventSnapshot} = setup('<input type="checkbox" />')
  expect(element).not.toBeChecked()
  await userEvent.click(element)
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[checked=true]

    input[checked=false] - pointerover
    input[checked=false] - pointerenter
    input[checked=false] - mouseover: Left (0)
    input[checked=false] - mouseenter: Left (0)
    input[checked=false] - pointermove
    input[checked=false] - mousemove: Left (0)
    input[checked=false] - pointerdown
    input[checked=false] - mousedown: Left (0)
    input[checked=false] - focus
    input[checked=false] - focusin
    input[checked=false] - pointerup
    input[checked=false] - mouseup: Left (0)
    input[checked=true] - click: Left (0)
      unchecked -> checked
    input[checked=true] - input
    input[checked=true] - change
  `)
})

test('clicking a disabled checkbox only fires pointer events', async () => {
  const {element, getEventSnapshot} = setup(
    '<input type="checkbox" disabled />',
  )
  await userEvent.click(element)
  expect(element).toBeDisabled()
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[checked=false]

    input[checked=false] - pointerover
    input[checked=false] - pointerenter
    input[checked=false] - pointermove
    input[checked=false] - pointerdown
    input[checked=false] - pointerup
  `)
  expect(element).toBeDisabled()
  expect(element).toHaveProperty('checked', false)
})

test('clicking a radio button', async () => {
  const {element, getEventSnapshot} = setup('<input type="radio" />')
  expect(element).not.toBeChecked()
  await userEvent.click(element)
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[checked=true]

    input[checked=false] - pointerover
    input[checked=false] - pointerenter
    input[checked=false] - mouseover: Left (0)
    input[checked=false] - mouseenter: Left (0)
    input[checked=false] - pointermove
    input[checked=false] - mousemove: Left (0)
    input[checked=false] - pointerdown
    input[checked=false] - mousedown: Left (0)
    input[checked=false] - focus
    input[checked=false] - focusin
    input[checked=false] - pointerup
    input[checked=false] - mouseup: Left (0)
    input[checked=true] - click: Left (0)
      unchecked -> checked
    input[checked=true] - input
    input[checked=true] - change
  `)

  expect(element).toHaveProperty('checked', true)
})

test('clicking a disabled radio button only fires pointer events', async () => {
  const {element, getEventSnapshot} = setup('<input type="radio" disabled />')
  await userEvent.click(element)
  expect(element).toBeDisabled()
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[checked=false]

    input[checked=false] - pointerover
    input[checked=false] - pointerenter
    input[checked=false] - pointermove
    input[checked=false] - pointerdown
    input[checked=false] - pointerup
  `)
  expect(element).toBeDisabled()

  expect(element).toHaveProperty('checked', false)
})

test('should fire the correct events for <div>', async () => {
  const {element, getEventSnapshot} = setup('<div></div>')
  await userEvent.click(element)
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: div

    div - pointerover
    div - pointerenter
    div - mouseover: Left (0)
    div - mouseenter: Left (0)
    div - pointermove
    div - mousemove: Left (0)
    div - pointerdown
    div - mousedown: Left (0)
    div - pointerup
    div - mouseup: Left (0)
    div - click: Left (0)
  `)
})

test('toggles the focus', async () => {
  const {element} = setup(`<div><input name="a" /><input name="b" /></div>`)

  const a = element.children[0]
  const b = element.children[1]

  expect(a).not.toHaveFocus()
  expect(b).not.toHaveFocus()

  await userEvent.click(a)
  expect(a).toHaveFocus()
  expect(b).not.toHaveFocus()

  await userEvent.click(b)
  expect(a).not.toHaveFocus()
  expect(b).toHaveFocus()
})

test('should blur the previous element', async () => {
  const {element, getEventSnapshot, clearEventCalls} = setup(
    `<div><input name="a" /><input name="b" /></div>`,
  )

  const a = element.children[0]
  const b = element.children[1]

  const aListeners = addListeners(a)
  const bListeners = addListeners(b)

  await userEvent.click(a)
  clearEventCalls()
  await userEvent.click(b)
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: div

    input[name="b"][value=""] - pointerover
    input[name="b"][value=""] - mouseover: Left (0)
    input[name="b"][value=""] - pointermove
    input[name="b"][value=""] - mousemove: Left (0)
    input[name="b"][value=""] - pointerdown
    input[name="b"][value=""] - mousedown: Left (0)
    input[name="a"][value=""] - focusout
    input[name="b"][value=""] - focusin
    input[name="b"][value=""] - pointerup
    input[name="b"][value=""] - mouseup: Left (0)
    input[name="b"][value=""] - click: Left (0)
  `)
  // focus/blur events don't bubble (but the focusout/focusin do!)
  // we just want to make sure the blur was fired on a
  // and the focus was fired on b
  expect(aListeners.eventWasFired('blur')).toBe(true)
  expect(bListeners.eventWasFired('focus')).toBe(true)
})

test('should not blur the previous element when mousedown prevents default', async () => {
  const {element, getEventSnapshot, clearEventCalls} = setup(
    `<div><input name="a" /><input name="b" /></div>`,
  )

  const a = element.children[0]
  const b = element.children[1]

  const aListeners = addListeners(a)
  const bListeners = addListeners(b, {
    eventHandlers: {mouseDown: e => e.preventDefault()},
  })

  await userEvent.click(a)
  clearEventCalls()
  await userEvent.click(b)
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: div

    input[name="b"][value=""] - pointerover
    input[name="b"][value=""] - mouseover: Left (0)
    input[name="b"][value=""] - pointermove
    input[name="b"][value=""] - mousemove: Left (0)
    input[name="b"][value=""] - pointerdown
    input[name="b"][value=""] - mousedown: Left (0)
    input[name="b"][value=""] - pointerup
    input[name="b"][value=""] - mouseup: Left (0)
    input[name="b"][value=""] - click: Left (0)
  `)
  // focus/blur events don't bubble (but the focusout do!)
  // we just want to make sure the blur was fired on a
  // and the focus was fired on b
  expect(aListeners.eventWasFired('blur')).toBe(false)
  expect(bListeners.eventWasFired('focus')).toBe(false)
})

test('does not lose focus when click updates focus', async () => {
  const {element} = setup(`<div><input /><button>focus</button></div>`)
  const input = element.children[0]
  const button = element.children[1]

  addEventListener(button, 'click', () => input.focus())

  expect(input).not.toHaveFocus()

  await userEvent.click(button)
  expect(input).toHaveFocus()

  await userEvent.click(button)
  expect(input).toHaveFocus()
})

test('gives focus to the form control when clicking the label', async () => {
  const {element} = setup(`
    <div>
      <label for="input">label</label>
      <input id="input" />
    </div>
  `)
  const label = element.children[0]
  const input = element.children[1]

  await userEvent.click(label)
  expect(input).toHaveFocus()
})

test('gives focus to the form control when clicking within a label', async () => {
  const {element} = setup(`
    <div>
      <label for="input"><span>label</span></label>
      <input id="input" />
    </div>
  `)
  const label = element.children[0]
  const span = label.firstChild
  const input = element.children[1]

  await userEvent.click(span)
  expect(input).toHaveFocus()
})

test('fires no events when clicking a label with a nested control that is disabled', async () => {
  const {element, getEventSnapshot} = setup(`<label><input disabled /></label>`)
  await userEvent.click(element)
  expect(getEventSnapshot()).toMatchInlineSnapshot(
    `No events were fired on: label`,
  )
})

test('does not crash if the label has no control', async () => {
  const {element} = setup(`<label for="input">label</label>`)
  await userEvent.click(element)
})

test('clicking a label checks the checkbox', async () => {
  const {element} = setup(`
    <div>
      <label for="input">label</label>
      <input id="input" type="checkbox" />
    </div>
  `)
  const label = element.children[0]
  const input = element.children[1]

  await userEvent.click(label)
  expect(input).toHaveFocus()
  expect(input).toBeChecked()
})

test('clicking a label checks the radio', async () => {
  const {element} = setup(`
    <div>
      <label for="input">label</label>
      <input id="input" name="radio" type="radio" />
    </div>
  `)
  const label = element.children[0]
  const input = element.children[1]

  await userEvent.click(label)
  expect(input).toHaveFocus()
  expect(input).toBeChecked()
})

test('submits a form when clicking on a <button>', async () => {
  const {element, eventWasFired} = setup(`<form><button>Submit</button></form>`)
  await userEvent.click(element.children[0])
  expect(eventWasFired('submit')).toBe(true)
})

test('does not submit a form when clicking on a <button type="button">', async () => {
  const {element, getEventSnapshot} = setup(`
    <form>
      <button type="button">Submit</button>
    </form>
  `)
  await userEvent.click(element.children[0])
  expect(getEventSnapshot()).not.toContain('submit')
})

test('does not fire blur on current element if is the same as previous', async () => {
  const {element, getEventSnapshot, clearEventCalls} = setup('<button />')

  await userEvent.click(element)
  expect(getEventSnapshot()).not.toContain('blur')

  clearEventCalls()

  await userEvent.click(element)
  expect(getEventSnapshot()).not.toContain('blur')
})

test('does not give focus when mouseDown is prevented', async () => {
  const {element} = setup('<input />', {
    eventHandlers: {mouseDown: e => e.preventDefault()},
  })
  await userEvent.click(element)
  expect(element).not.toHaveFocus()
})

test('fires mouse events with the correct properties', async () => {
  const {element, getClickEventsSnapshot} = setup('<div></div>')
  await userEvent.click(element)
  expect(getClickEventsSnapshot()).toMatchInlineSnapshot(`
    pointerover
    pointerenter
    mouseover - button=0; buttons=0; detail=0
    mouseenter - button=0; buttons=0; detail=0
    pointermove
    mousemove - button=0; buttons=0; detail=0
    pointerdown
    mousedown - button=0; buttons=1; detail=1
    pointerup
    mouseup - button=0; buttons=1; detail=1
    click - button=0; buttons=1; detail=1
  `)
})

test('fires mouse events with custom button property', async () => {
  const {element, getClickEventsSnapshot} = setup('<div></div>')
  await userEvent.click(element, {
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
    pointerdown
    mousedown - button=1; buttons=4; detail=1
    pointerup
    mouseup - button=1; buttons=4; detail=1
    click - button=1; buttons=4; detail=1
  `)
})

test('fires mouse events with custom buttons property', async () => {
  const {element, getClickEventsSnapshot} = setup('<div></div>')

  await userEvent.click(element, {buttons: 4})
  expect(getClickEventsSnapshot()).toMatchInlineSnapshot(`
    pointerover
    pointerenter
    mouseover - button=0; buttons=0; detail=0
    mouseenter - button=0; buttons=0; detail=0
    pointermove
    mousemove - button=0; buttons=0; detail=0
    pointerdown
    mousedown - button=1; buttons=4; detail=1
    pointerup
    mouseup - button=1; buttons=4; detail=1
    click - button=1; buttons=4; detail=1
  `)
})

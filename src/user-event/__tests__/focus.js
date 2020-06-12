import {userEvent} from '../../'
import {setup} from './helpers/utils'

test('focus a button', async () => {
  const {element, getEventSnapshot} = setup(`<button />`)
  await userEvent.focus(element)
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: button

    button - focus
    button - focusin
  `)
  expect(element).toHaveFocus()
})

test('no events fired on an unfocusable input', async () => {
  const {element, getEventSnapshot} = setup(`<div />`)
  await userEvent.focus(element)
  expect(getEventSnapshot()).toMatchInlineSnapshot(
    `No events were fired on: div`,
  )
  expect(element).not.toHaveFocus()
})

test('focus with tabindex', async () => {
  const {element, getEventSnapshot} = setup(`<div tabindex="0" />`)
  await userEvent.focus(element)
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: div

    div - focus
    div - focusin
  `)
  expect(element).toHaveFocus()
})

test('no events fired on a disabled focusable input', async () => {
  const {element, getEventSnapshot} = setup(`<button disabled />`)
  await userEvent.focus(element)
  expect(getEventSnapshot()).toMatchInlineSnapshot(
    `No events were fired on: button`,
  )
  expect(element).not.toHaveFocus()
})

test('no events fired if the element is already focused', async () => {
  const {element, getEventSnapshot, clearEventCalls} = setup(`<button />`)
  await userEvent.focus(element)

  clearEventCalls()

  await userEvent.focus(element)
  expect(getEventSnapshot()).toMatchInlineSnapshot(
    `No events were fired on: button`,
  )
  expect(element).toHaveFocus()
})

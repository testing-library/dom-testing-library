import userEvent from '..'
import {setup} from './helpers/utils'

test('clears text', () => {
  const {element, getEventCalls} = setup('<input value="hello" />')
  userEvent.clear(element)
  expect(element).toHaveValue('')
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
    keydown: Backspace (8)
    keyup: Backspace (8)
    input: "{SELECTION}hello{/SELECTION}" -> "hello"
    change
  `)
})

test('does not clear text on disabled inputs', () => {
  const {element, getEventCalls} = setup('<input value="hello" disabled />')
  userEvent.clear(element)
  expect(element).toHaveValue('hello')
  expect(getEventCalls()).toMatchInlineSnapshot(
    `No events were fired on: input[value="hello"]`,
  )
})

test('does not clear text on readonly inputs', () => {
  const {element, getEventCalls} = setup('<input value="hello" readonly />')
  userEvent.clear(element)
  expect(element).toHaveValue('hello')
  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: input[value="hello"]

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
    keydown: Backspace (8)
    keyup: Backspace (8)
  `)
})

test('clears even on inputs that cannot (programmatically) have a selection', () => {
  const {element: email} = setup('<input value="a@b.c" type="email" />')
  userEvent.clear(email)
  expect(email).toHaveValue('')

  const {element: password} = setup('<input value="pswrd" type="password" />')
  userEvent.clear(password)
  expect(password).toHaveValue('')

  const {element: number} = setup('<input value="12" type="number" />')
  userEvent.clear(number)
  // jest-dom does funny stuff with toHaveValue on number inputs
  expect(number.value).toBe('')
})

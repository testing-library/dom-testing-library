import {userEvent} from '../../'
import {setup} from './helpers/utils'

test('clears text', async () => {
  const {element, getEventSnapshot} = setup('<input value="hello" />')
  await userEvent.clear(element)
  expect(element).toHaveValue('')
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value=""]

    input[value="hello"] - focus
    input[value="hello"] - select
    input[value="hello"] - keydown: Delete (46)
    input[value=""] - input
      "{SELECTION}hello{/SELECTION}" -> "{CURSOR}"
    input[value=""] - keyup: Delete (46)
  `)
})

test('works with textarea', async () => {
  const {element} = setup('<textarea>hello</textarea>')
  await userEvent.clear(element)
  expect(element).toHaveValue('')
})

test('does not clear text on disabled inputs', async () => {
  const {element, getEventSnapshot} = setup('<input value="hello" disabled />')
  await userEvent.clear(element)
  expect(element).toHaveValue('hello')
  expect(getEventSnapshot()).toMatchInlineSnapshot(
    `No events were fired on: input[value="hello"]`,
  )
})

test('does not clear text on readonly inputs', async () => {
  const {element, getEventSnapshot} = setup('<input value="hello" readonly />')
  await userEvent.clear(element)
  expect(element).toHaveValue('hello')
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value="hello"]

    input[value="hello"] - focus
    input[value="hello"] - select
    input[value="hello"] - keydown: Delete (46)
    input[value="hello"] - keyup: Delete (46)
  `)
})

test('clears even on inputs that cannot (programmatically) have a selection', async () => {
  const {element: email} = setup('<input value="a@b.c" type="email" />')
  await userEvent.clear(email)
  expect(email).toHaveValue('')

  const {element: password} = setup('<input value="pswrd" type="password" />')
  await userEvent.clear(password)
  expect(password).toHaveValue('')

  const {element: number} = setup('<input value="12" type="number" />')
  await userEvent.clear(number)
  // jest-dom does funny stuff with toHaveValue on number inputs
  expect(number.value).toBe('')
})

test('non-inputs/textareas are currently unsupported', async () => {
  const {element} = setup('<div />')
  const error = await userEvent.clear(element).catch(e => e)
  expect(error).toMatchInlineSnapshot(
    `[Error: clear currently only supports input and textarea elements.]`,
  )
})

import {userEvent} from '../../'
import {setup} from './helpers/utils'

test('should paste text in input', async () => {
  const {element, getEventSnapshot} = setup('<input />')

  const text = 'Hello, world!'
  await userEvent.paste(element, text)
  expect(element).toHaveValue(text)
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value="Hello, world!"]

    input[value=""] - focus
    input[value=""] - select
    input[value="Hello, world!"] - input
      "{CURSOR}" -> "Hello, world!{CURSOR}"
    input[value="Hello, world!"] - select
  `)
})

test('should paste text in textarea', async () => {
  const {element, getEventSnapshot} = setup('<textarea />')

  const text = 'Hello, world!'
  await userEvent.paste(element, text)
  expect(element).toHaveValue(text)
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: textarea[value="Hello, world!"]

    textarea[value=""] - focus
    textarea[value=""] - select
    textarea[value="Hello, world!"] - input
      "{CURSOR}" -> "Hello, world!{CURSOR}"
    textarea[value="Hello, world!"] - select
  `)
})

test('does not paste when readOnly', async () => {
  const {element, getEventSnapshot} = setup('<input readonly />')

  await userEvent.paste(element, 'hi')
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value=""]

    input[value=""] - focus
    input[value=""] - select
  `)
})

test('does not paste when disabled', async () => {
  const {element, getEventSnapshot} = setup('<input disabled />')

  await userEvent.paste(element, 'hi')
  expect(getEventSnapshot()).toMatchInlineSnapshot(
    `No events were fired on: input[value=""]`,
  )
})

test.each(['input', 'textarea'])(
  'should paste text in <%s> up to maxLength if provided',
  async type => {
    const {element} = setup(`<${type} maxlength="10" />`)

    await userEvent.type(element, 'superlongtext')
    expect(element).toHaveValue('superlongt')

    element.value = ''
    await userEvent.paste(element, 'superlongtext')
    expect(element).toHaveValue('superlongt')
  },
)

test.each(['input', 'textarea'])(
  'should append text in <%s> up to maxLength if provided',
  async type => {
    const {element} = setup(`<${type} maxlength="10" />`)

    await userEvent.type(element, 'superlong')
    await userEvent.type(element, 'text')
    expect(element).toHaveValue('superlongt')

    element.value = ''
    await userEvent.paste(element, 'superlongtext')
    expect(element).toHaveValue('superlongt')
  },
)

test('should replace selected text all at once', async () => {
  const {element} = setup('<input value="hello world" />')

  const selectionStart = 'hello world'.search('world')
  const selectionEnd = selectionStart + 'world'.length
  element.setSelectionRange(selectionStart, selectionEnd)
  await userEvent.paste(element, 'friend')
  expect(element).toHaveValue('hello friend')
})

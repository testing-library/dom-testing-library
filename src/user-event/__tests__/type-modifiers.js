import userEvent from '..'
import {setup} from './helpers/utils'

// Note, use the setup function at the bottom of the file...
// but don't hurt yourself trying to read it 😅

// keep in mind that we do not handle modifier interactions. This is primarily
// because modifiers behave differently on different operating systems.
// For example: {alt}{backspace}{/alt} will remove everything from the current
// cursor position to the beginning of the word on Mac, but you need to use
// {ctrl}{backspace}{/ctrl} to do that on Windows. And that doesn't appear to
// be consistent within an OS either 🙃
// So we're not going to even try.

// This also means that '{shift}a' will fire an input event with the shiftKey,
// but will not capitalize "a".

test('{esc} triggers typing the escape character', async () => {
  const {element, getEventCalls} = setup('<input />')

  await userEvent.type(element, '{esc}')

  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: input[value=""]

    focus
    keydown: Escape (27)
    keyup: Escape (27)
  `)
})

test('a{backspace}', async () => {
  const {element, getEventCalls} = setup('<input />')
  await userEvent.type(element, 'a{backspace}')
  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: input[value=""]

    focus
    keydown: a (97)
    keypress: a (97)
    input: "{CURSOR}" -> "a"
    keyup: a (97)
    keydown: Backspace (8)
    input: "a{CURSOR}" -> ""
    keyup: Backspace (8)
  `)
})

test('{backspace}a', async () => {
  const {element, getEventCalls} = setup('<input />')
  await userEvent.type(element, '{backspace}a')
  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: input[value="a"]

    focus
    keydown: Backspace (8)
    keyup: Backspace (8)
    keydown: a (97)
    keypress: a (97)
    input: "{CURSOR}" -> "a"
    keyup: a (97)
  `)
})

test('{backspace} triggers typing the backspace character and deletes the character behind the cursor', async () => {
  const {element, getEventCalls} = setup('<input value="yo" />')
  element.setSelectionRange(1, 1)

  await userEvent.type(element, '{backspace}')

  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: input[value="o"]

    focus
    keydown: Backspace (8)
    input: "y{CURSOR}o" -> "o"
    keyup: Backspace (8)
  `)
})

test('{backspace} on a readOnly input', async () => {
  const {element, getEventCalls} = setup('<input readonly value="yo" />')
  element.setSelectionRange(1, 1)

  await userEvent.type(element, '{backspace}')

  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: input[value="yo"]

    focus
    keydown: Backspace (8)
    keyup: Backspace (8)
  `)
})

test('{backspace} does not fire input if keydown prevents default', async () => {
  const {element, getEventCalls} = setup('<input value="yo" />', {
    eventHandlers: {keyDown: e => e.preventDefault()},
  })
  element.setSelectionRange(1, 1)

  await userEvent.type(element, '{backspace}')

  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: input[value="yo"]

    focus
    keydown: Backspace (8)
    keyup: Backspace (8)
  `)
})

test('{backspace} deletes the selected range', async () => {
  const {element, getEventCalls} = setup('<input value="Hi there" />')
  element.setSelectionRange(1, 5)

  await userEvent.type(element, '{backspace}')

  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: input[value="Here"]

    focus
    keydown: Backspace (8)
    input: "H{SELECTION}i th{/SELECTION}ere" -> "Here"
    keyup: Backspace (8)
  `)
})

test('{backspace} on an input type that does not support selection ranges', async () => {
  const {element} = setup('<input type="email" value="yo@example.com" />')
  // note: you cannot even call setSelectionRange on these kinds of elements...
  await userEvent.type(element, '{backspace}{backspace}a')
  // removed "m" then "o" then add "a"
  expect(element).toHaveValue('yo@example.ca')
})

test('{alt}a{/alt}', async () => {
  const {element, getEventCalls} = setup('<input />')

  await userEvent.type(element, '{alt}a{/alt}')

  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: input[value="a"]

    focus
    keydown: Alt (18) {alt}
    keydown: a (97) {alt}
    keypress: a (97) {alt}
    input: "{CURSOR}" -> "a"
    keyup: a (97) {alt}
    keyup: Alt (18)
  `)
})

test('{meta}a{/meta}', async () => {
  const {element, getEventCalls} = setup('<input />')

  await userEvent.type(element, '{meta}a{/meta}')

  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: input[value="a"]

    focus
    keydown: Meta (93) {meta}
    keydown: a (97) {meta}
    keypress: a (97) {meta}
    input: "{CURSOR}" -> "a"
    keyup: a (97) {meta}
    keyup: Meta (93)
  `)
})

test('{ctrl}a{/ctrl}', async () => {
  const {element, getEventCalls} = setup('<input />')

  await userEvent.type(element, '{ctrl}a{/ctrl}')

  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: input[value="a"]

    focus
    keydown: Control (17) {ctrl}
    keydown: a (97) {ctrl}
    keypress: a (97) {ctrl}
    input: "{CURSOR}" -> "a"
    keyup: a (97) {ctrl}
    keyup: Control (17)
  `)
})

test('{shift}a{/shift}', async () => {
  const {element, getEventCalls} = setup('<input />')

  await userEvent.type(element, '{shift}a{/shift}')

  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: input[value="a"]

    focus
    keydown: Shift (16) {shift}
    keydown: a (97) {shift}
    keypress: a (97) {shift}
    input: "{CURSOR}" -> "a"
    keyup: a (97) {shift}
    keyup: Shift (16)
  `)
})

test('a{enter}', async () => {
  const {element, getEventCalls} = setup('<input />')

  await userEvent.type(element, 'a{enter}')

  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: input[value="a"]

    focus
    keydown: a (97)
    keypress: a (97)
    input: "{CURSOR}" -> "a"
    keyup: a (97)
    keydown: Enter (13)
    keypress: Enter (13)
    keyup: Enter (13)
  `)
})

test('{enter} with preventDefault keydown', async () => {
  const {element, getEventCalls} = setup('<input />', {
    eventHandlers: {
      keyDown: e => e.preventDefault(),
    },
  })

  await userEvent.type(element, '{enter}')

  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: input[value=""]

    focus
    keydown: Enter (13)
    keyup: Enter (13)
  `)
})

test('{enter} on a button', async () => {
  const {element, getEventCalls} = setup('<button />')

  await userEvent.type(element, '{enter}')

  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: button

    focus
    keydown: Enter (13)
    keypress: Enter (13)
    click: Left (0)
    keyup: Enter (13)
  `)
})

test('{enter} on a textarea', async () => {
  const {element, getEventCalls} = setup('<textarea></textarea>')

  await userEvent.type(element, '{enter}')

  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: textarea[value="\\n"]

    focus
    keydown: Enter (13)
    keypress: Enter (13)
    input: "{CURSOR}" -> "
    "
    keyup: Enter (13)
  `)
})

test('{meta}{enter}{/meta} on a button', async () => {
  const {element, getEventCalls} = setup('<button />')

  await userEvent.type(element, '{meta}{enter}{/meta}')

  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: button

    focus
    keydown: Meta (93) {meta}
    keydown: Enter (13) {meta}
    keypress: Enter (13) {meta}
    click: Left (0) {meta}
    keyup: Enter (13) {meta}
    keyup: Meta (93)
  `)
})

test('{meta}{alt}{ctrl}a{/ctrl}{/alt}{/meta}', async () => {
  const {element, getEventCalls} = setup('<input />')

  await userEvent.type(element, '{meta}{alt}{ctrl}a{/ctrl}{/alt}{/meta}')

  expect(getEventCalls()).toMatchInlineSnapshot(`
    Events fired on: input[value="a"]

    focus
    keydown: Meta (93) {meta}
    keydown: Alt (18) {alt}{meta}
    keydown: Control (17) {alt}{meta}{ctrl}
    keydown: a (97) {alt}{meta}{ctrl}
    keypress: a (97) {alt}{meta}{ctrl}
    input: "{CURSOR}" -> "a"
    keyup: a (97) {alt}{meta}{ctrl}
    keyup: Control (17) {alt}{meta}
    keyup: Alt (18) {meta}
    keyup: Meta (93)
  `)
})

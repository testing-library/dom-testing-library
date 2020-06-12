import {userEvent} from '../../'
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
  const {element, getEventSnapshot} = setup('<input />')

  await userEvent.type(element, '{esc}')

  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value=""]

    input[value=""] - focus
    input[value=""] - select
    input[value=""] - keydown: Escape (27)
    input[value=""] - keyup: Escape (27)
  `)
})

test('a{backspace}', async () => {
  const {element, getEventSnapshot} = setup('<input />')
  await userEvent.type(element, 'a{backspace}')
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value=""]

    input[value=""] - focus
    input[value=""] - select
    input[value=""] - keydown: a (97)
    input[value=""] - keypress: a (97)
    input[value=""] - input
      "{CURSOR}" -> "a{CURSOR}"
    input[value="a"] - keyup: a (97)
    input[value="a"] - keydown: Backspace (8)
    input[value="a"] - input
      "a{CURSOR}" -> "{CURSOR}"
    input[value=""] - keyup: Backspace (8)
  `)
})

test('{backspace}a', async () => {
  const {element, getEventSnapshot} = setup('<input />')
  await userEvent.type(element, '{backspace}a')
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value="a"]

    input[value=""] - focus
    input[value=""] - select
    input[value=""] - keydown: Backspace (8)
    input[value=""] - keyup: Backspace (8)
    input[value=""] - keydown: a (97)
    input[value=""] - keypress: a (97)
    input[value=""] - input
      "{CURSOR}" -> "a{CURSOR}"
    input[value="a"] - keyup: a (97)
  `)
})

test('{backspace} triggers typing the backspace character and deletes the character behind the cursor', async () => {
  const {element, getEventSnapshot} = setup('<input value="yo" />')
  element.setSelectionRange(1, 1)

  await userEvent.type(element, '{backspace}')

  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value="o"]

    input[value="yo"] - select
    input[value="yo"] - focus
    input[value="yo"] - keydown: Backspace (8)
    input[value="yo"] - input
      "y{CURSOR}o" -> "o{CURSOR}"
    input[value="o"] - select
    input[value="o"] - keyup: Backspace (8)
  `)
})

test('{backspace} on a readOnly input', async () => {
  const {element, getEventSnapshot} = setup('<input readonly value="yo" />')
  element.setSelectionRange(1, 1)

  await userEvent.type(element, '{backspace}')

  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value="yo"]

    input[value="yo"] - select
    input[value="yo"] - focus
    input[value="yo"] - keydown: Backspace (8)
    input[value="yo"] - keyup: Backspace (8)
  `)
})

test('{backspace} does not fire input if keydown prevents default', async () => {
  const {element, getEventSnapshot} = setup('<input value="yo" />', {
    eventHandlers: {keyDown: e => e.preventDefault()},
  })
  element.setSelectionRange(1, 1)

  await userEvent.type(element, '{backspace}')

  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value="yo"]

    input[value="yo"] - select
    input[value="yo"] - focus
    input[value="yo"] - keydown: Backspace (8)
    input[value="yo"] - keyup: Backspace (8)
  `)
})

test('{backspace} deletes the selected range', async () => {
  const {element, getEventSnapshot} = setup('<input value="Hi there" />')
  element.setSelectionRange(1, 5)

  await userEvent.type(element, '{backspace}')

  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value="Here"]

    input[value="Hi there"] - select
    input[value="Hi there"] - focus
    input[value="Hi there"] - keydown: Backspace (8)
    input[value="Hi there"] - input
      "H{SELECTION}i th{/SELECTION}ere" -> "Here{CURSOR}"
    input[value="Here"] - select
    input[value="Here"] - keyup: Backspace (8)
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
  const {element, getEventSnapshot} = setup('<input />')

  await userEvent.type(element, '{alt}a{/alt}')

  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value="a"]

    input[value=""] - focus
    input[value=""] - select
    input[value=""] - keydown: Alt (18) {alt}
    input[value=""] - keydown: a (97) {alt}
    input[value=""] - keypress: a (97) {alt}
    input[value=""] - input
      "{CURSOR}" -> "a{CURSOR}"
    input[value="a"] - keyup: a (97) {alt}
    input[value="a"] - keyup: Alt (18)
  `)
})

test('{meta}a{/meta}', async () => {
  const {element, getEventSnapshot} = setup('<input />')

  await userEvent.type(element, '{meta}a{/meta}')

  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value="a"]

    input[value=""] - focus
    input[value=""] - select
    input[value=""] - keydown: Meta (93) {meta}
    input[value=""] - keydown: a (97) {meta}
    input[value=""] - keypress: a (97) {meta}
    input[value=""] - input
      "{CURSOR}" -> "a{CURSOR}"
    input[value="a"] - keyup: a (97) {meta}
    input[value="a"] - keyup: Meta (93)
  `)
})

test('{ctrl}a{/ctrl}', async () => {
  const {element, getEventSnapshot} = setup('<input />')

  await userEvent.type(element, '{ctrl}a{/ctrl}')

  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value="a"]

    input[value=""] - focus
    input[value=""] - select
    input[value=""] - keydown: Control (17) {ctrl}
    input[value=""] - keydown: a (97) {ctrl}
    input[value=""] - keypress: a (97) {ctrl}
    input[value=""] - input
      "{CURSOR}" -> "a{CURSOR}"
    input[value="a"] - keyup: a (97) {ctrl}
    input[value="a"] - keyup: Control (17)
  `)
})

test('{shift}a{/shift}', async () => {
  const {element, getEventSnapshot} = setup('<input />')

  await userEvent.type(element, '{shift}a{/shift}')

  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value="a"]

    input[value=""] - focus
    input[value=""] - select
    input[value=""] - keydown: Shift (16) {shift}
    input[value=""] - keydown: a (97) {shift}
    input[value=""] - keypress: a (97) {shift}
    input[value=""] - input
      "{CURSOR}" -> "a{CURSOR}"
    input[value="a"] - keyup: a (97) {shift}
    input[value="a"] - keyup: Shift (16)
  `)
})

test('a{enter}', async () => {
  const {element, getEventSnapshot} = setup('<input />')

  await userEvent.type(element, 'a{enter}')

  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value="a"]

    input[value=""] - focus
    input[value=""] - select
    input[value=""] - keydown: a (97)
    input[value=""] - keypress: a (97)
    input[value=""] - input
      "{CURSOR}" -> "a{CURSOR}"
    input[value="a"] - keyup: a (97)
    input[value="a"] - keydown: Enter (13)
    input[value="a"] - keypress: Enter (13)
    input[value="a"] - keyup: Enter (13)
  `)
})

test('{enter} with preventDefault keydown', async () => {
  const {element, getEventSnapshot} = setup('<input />', {
    eventHandlers: {
      keyDown: e => e.preventDefault(),
    },
  })

  await userEvent.type(element, '{enter}')

  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value=""]

    input[value=""] - focus
    input[value=""] - select
    input[value=""] - keydown: Enter (13)
    input[value=""] - keyup: Enter (13)
  `)
})

test('{enter} on a button', async () => {
  const {element, getEventSnapshot} = setup('<button />')

  await userEvent.type(element, '{enter}')

  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: button

    button - focus
    button - keydown: Enter (13)
    button - keypress: Enter (13)
    button - click: Left (0)
    button - keyup: Enter (13)
  `)
})

test('{enter} on a textarea', async () => {
  const {element, getEventSnapshot} = setup('<textarea></textarea>')

  await userEvent.type(element, '{enter}')

  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: textarea[value="\\n"]

    textarea[value=""] - focus
    textarea[value=""] - select
    textarea[value=""] - keydown: Enter (13)
    textarea[value=""] - keypress: Enter (13)
    textarea[value=""] - input
      "{CURSOR}" -> "\\n{CURSOR}"
    textarea[value="\\n"] - keyup: Enter (13)
  `)
})

test('{meta}{enter}{/meta} on a button', async () => {
  const {element, getEventSnapshot} = setup('<button />')

  await userEvent.type(element, '{meta}{enter}{/meta}')

  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: button

    button - focus
    button - keydown: Meta (93) {meta}
    button - keydown: Enter (13) {meta}
    button - keypress: Enter (13) {meta}
    button - click: Left (0) {meta}
    button - keyup: Enter (13) {meta}
    button - keyup: Meta (93)
  `)
})

test('{meta}{alt}{ctrl}a{/ctrl}{/alt}{/meta}', async () => {
  const {element, getEventSnapshot} = setup('<input />')

  await userEvent.type(element, '{meta}{alt}{ctrl}a{/ctrl}{/alt}{/meta}')

  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value="a"]

    input[value=""] - focus
    input[value=""] - select
    input[value=""] - keydown: Meta (93) {meta}
    input[value=""] - keydown: Alt (18) {alt}{meta}
    input[value=""] - keydown: Control (17) {alt}{meta}{ctrl}
    input[value=""] - keydown: a (97) {alt}{meta}{ctrl}
    input[value=""] - keypress: a (97) {alt}{meta}{ctrl}
    input[value=""] - input
      "{CURSOR}" -> "a{CURSOR}"
    input[value="a"] - keyup: a (97) {alt}{meta}{ctrl}
    input[value="a"] - keyup: Control (17) {alt}{meta}
    input[value="a"] - keyup: Alt (18) {meta}
    input[value="a"] - keyup: Meta (93)
  `)
})

test('{selectall} selects all the text', async () => {
  const value = 'abcdefg'
  const {element, clearEventCalls, getEventSnapshot} = setup(
    `<input value="${value}" />`,
  )
  element.setSelectionRange(2, 6)

  clearEventCalls()

  await userEvent.type(element, '{selectall}')

  expect(element.selectionStart).toBe(0)
  expect(element.selectionEnd).toBe(value.length)
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value="abcdefg"]

    input[value="abcdefg"] - select
    input[value="abcdefg"] - focus
    input[value="abcdefg"] - select
  `)
})

test('{del} at the start of the input', async () => {
  const {element, getEventSnapshot} = setup(`<input value="hello" />`)

  await userEvent.type(element, '{del}', {
    initialSelectionStart: 0,
    initialSelectionEnd: 0,
  })

  expect(element.selectionStart).toBe(0)
  expect(element.selectionEnd).toBe(0)
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value="ello"]

    input[value="hello"] - focus
    input[value="hello"] - select
    input[value="hello"] - keydown: Delete (46)
    input[value="hello"] - input
      "{CURSOR}hello" -> "ello{CURSOR}"
    input[value="ello"] - select
    input[value="ello"] - keyup: Delete (46)
  `)
})

test('{del} at end of the input', async () => {
  const {element, getEventSnapshot} = setup(`<input value="hello" />`)

  await userEvent.type(element, '{del}')

  expect(element.selectionStart).toBe(element.value.length)
  expect(element.selectionEnd).toBe(element.value.length)
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value="hello"]

    input[value="hello"] - focus
    input[value="hello"] - select
    input[value="hello"] - keydown: Delete (46)
    input[value="hello"] - keyup: Delete (46)
  `)
})

test('{del} in the middle of the input', async () => {
  const {element, getEventSnapshot} = setup(`<input value="hello" />`)

  await userEvent.type(element, '{del}', {
    initialSelectionStart: 2,
    initialSelectionEnd: 2,
  })

  expect(element.selectionStart).toBe(2)
  expect(element.selectionEnd).toBe(2)
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value="helo"]

    input[value="hello"] - focus
    input[value="hello"] - select
    input[value="hello"] - keydown: Delete (46)
    input[value="hello"] - input
      "he{CURSOR}llo" -> "helo{CURSOR}"
    input[value="helo"] - select
    input[value="helo"] - keyup: Delete (46)
  `)
})

test('{del} with a selection range', async () => {
  const {element, getEventSnapshot} = setup(`<input value="hello" />`)

  await userEvent.type(element, '{del}', {
    initialSelectionStart: 1,
    initialSelectionEnd: 3,
  })

  expect(element.selectionStart).toBe(1)
  expect(element.selectionEnd).toBe(1)
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value="hlo"]

    input[value="hello"] - focus
    input[value="hello"] - select
    input[value="hello"] - keydown: Delete (46)
    input[value="hello"] - input
      "h{SELECTION}el{/SELECTION}lo" -> "hlo{CURSOR}"
    input[value="hlo"] - select
    input[value="hlo"] - keyup: Delete (46)
  `)
})

// TODO: eventually we'll want to support this, but currently we cannot
// because selection ranges are (intentially) unsupported in certain input types
// per the spec.
test('{del} on an input that does not support selection range does not change the value', async () => {
  const {element, eventWasFired} = setup(`<input type="email" value="a@b.c" />`)

  await userEvent.type(element, '{del}')
  expect(element).toHaveValue('a@b.c')
  expect(eventWasFired('input')).not.toBe(true)
})

test('{del} does not delete if keydown is prevented', async () => {
  const {element, eventWasFired} = setup(`<input value="hello" />`, {
    eventHandlers: {keyDown: e => e.preventDefault()},
  })

  await userEvent.type(element, '{del}', {
    initialSelectionStart: 2,
    initialSelectionEnd: 2,
  })
  expect(element).toHaveValue('hello')
  expect(element.selectionStart).toBe(2)
  expect(element.selectionEnd).toBe(2)
  expect(eventWasFired('input')).not.toBe(true)
})

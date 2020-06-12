import {userEvent} from '../../'
import {setup, addListeners} from './helpers/utils'

test('fires events when tabbing between two elements', async () => {
  const {element, getEventSnapshot, clearEventCalls} = setup(
    `<div><input id="a" /><input id="b" /></div>`,
  )
  const a = element.children[0]
  const b = element.children[1]
  await userEvent.focus(a)
  clearEventCalls()

  const aListeners = addListeners(a)
  const bListeners = addListeners(b)

  await userEvent.tab()
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: div
    
    input#a[value=""] - keydown: Tab (9)
    input#a[value=""] - focusout
    input#b[value=""] - focusin
    input#b[value=""] - keyup: Tab (9)
  `)
  // blur/focus do not bubble
  expect(aListeners.eventWasFired('blur')).toBe(true)
  expect(bListeners.eventWasFired('focus')).toBe(true)
})

test('does not change focus if default prevented on keydown', async () => {
  const {element, getEventSnapshot, clearEventCalls} = setup(
    `<div><input id="a" /><input id="b" /></div>`,
  )
  const a = element.children[0]
  const b = element.children[1]
  await userEvent.focus(a)
  clearEventCalls()

  const aListeners = addListeners(a, {
    eventHandlers: {keyDown: e => e.preventDefault()},
  })
  const bListeners = addListeners(b)

  await userEvent.tab()
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: div
    
    input#a[value=""] - keydown: Tab (9)
    input#a[value=""] - keyup: Tab (9)
  `)
  // blur/focus do not bubble
  expect(aListeners.eventWasFired('blur')).toBe(false)
  expect(bListeners.eventWasFired('focus')).toBe(false)
})

test('fires correct events with shift key', async () => {
  const {element, getEventSnapshot, clearEventCalls} = setup(
    `<div><input id="a" /><input id="b" /></div>`,
  )
  const a = element.children[0]
  const b = element.children[1]
  await userEvent.focus(b)
  clearEventCalls()

  const aListeners = addListeners(a)
  const bListeners = addListeners(b)

  await userEvent.tab({shift: true})
  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: div

    input#b[value=""] - keydown: Shift (16) {shift}
    input#b[value=""] - keydown: Tab (9) {shift}
    input#b[value=""] - focusout
    input#a[value=""] - focusin
    input#a[value=""] - keyup: Tab (9) {shift}
    input#a[value=""] - keyup: Shift (16)
  `)
  // blur/focus do not bubble
  expect(aListeners.eventWasFired('focus')).toBe(true)
  expect(bListeners.eventWasFired('blur')).toBe(true)
})

test('should cycle elements in document tab order', async () => {
  setup(`
    <div>
      <input data-testid="element" type="checkbox" />
      <input data-testid="element" type="radio" />
      <input data-testid="element" type="number" />
    </div>
  `)

  const [checkbox, radio, number] = document.querySelectorAll(
    '[data-testid="element"]',
  )

  expect(document.body).toHaveFocus()

  await userEvent.tab()

  expect(checkbox).toHaveFocus()

  await userEvent.tab()

  expect(radio).toHaveFocus()

  await userEvent.tab()

  expect(number).toHaveFocus()

  await userEvent.tab()

  // cycle goes back to first element
  expect(checkbox).toHaveFocus()
})

test('should go backwards when shift = true', async () => {
  setup(`
    <div>
      <input data-testid="element" type="checkbox" />
      <input data-testid="element" type="radio" />
      <input data-testid="element" type="number" />
    </div>`)

  const [checkbox, radio, number] = document.querySelectorAll(
    '[data-testid="element"]',
  )

  radio.focus()

  await userEvent.tab({shift: true})

  expect(checkbox).toHaveFocus()

  await userEvent.tab({shift: true})

  expect(number).toHaveFocus()
})

test('should respect tabindex, regardless of dom position', async () => {
  setup(`
    <div>
      <input data-testid="element" tabIndex="2" type="checkbox" />
      <input data-testid="element" tabIndex="1" type="radio" />
      <input data-testid="element" tabIndex="3" type="number" />
    </div>`)

  const [checkbox, radio, number] = document.querySelectorAll(
    '[data-testid="element"]',
  )

  await userEvent.tab()

  expect(radio).toHaveFocus()

  await userEvent.tab()

  expect(checkbox).toHaveFocus()

  await userEvent.tab()

  expect(number).toHaveFocus()

  await userEvent.tab()

  expect(radio).toHaveFocus()
})

test('should respect tab index order, then DOM order', async () => {
  setup(`
    <div>
      <input data-testid="element" tabIndex="0" type="checkbox" />
      <input data-testid="element" tabIndex="1" type="radio" />
      <input data-testid="element" tabIndex="0" type="number" />
    </div>`)

  const [checkbox, radio, number] = document.querySelectorAll(
    '[data-testid="element"]',
  )

  await userEvent.tab()

  expect(checkbox).toHaveFocus()

  await userEvent.tab()

  expect(number).toHaveFocus()

  await userEvent.tab()

  expect(radio).toHaveFocus()

  await userEvent.tab()

  expect(checkbox).toHaveFocus()
})

test('should suport a mix of elements with/without tab index', async () => {
  setup(`
    <div>
      <input data-testid="element" tabIndex="0" type="checkbox" />
      <input data-testid="element" tabIndex="1" type="radio" />
      <input data-testid="element" type="number" />
    </div>`)

  const [checkbox, radio, number] = document.querySelectorAll(
    '[data-testid="element"]',
  )

  await userEvent.tab()

  expect(checkbox).toHaveFocus()
  await userEvent.tab()

  expect(number).toHaveFocus()
  await userEvent.tab()

  expect(radio).toHaveFocus()
})

test('should not tab to <a> with no href', async () => {
  setup(`
    <div>
      <input data-testid="element" tabIndex="0" type="checkbox" />
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a>ignore this</a>
      <a data-testid="element" href="http://www.testingjavascript.com">
        a link
      </a>
    </div>`)

  const [checkbox, link] = document.querySelectorAll('[data-testid="element"]')

  await userEvent.tab()

  expect(checkbox).toHaveFocus()

  await userEvent.tab()

  expect(link).toHaveFocus()
})

test('should stay within a focus trap', async () => {
  setup(`
    <>
      <div data-testid="div1">
        <input data-testid="element" type="checkbox" />
        <input data-testid="element" type="radio" />
        <input data-testid="element" type="number" />
      </div>
      <div data-testid="div2">
        <input data-testid="element" foo="bar" type="checkbox" />
        <input data-testid="element" foo="bar" type="radio" />
        <input data-testid="element" foo="bar" type="number" />
      </div>
    </>`)

  const [div1, div2] = [
    document.querySelector('[data-testid="div1"]'),
    document.querySelector('[data-testid="div2"]'),
  ]
  const [
    checkbox1,
    radio1,
    number1,
    checkbox2,
    radio2,
    number2,
  ] = document.querySelectorAll('[data-testid="element"]')

  expect(document.body).toHaveFocus()

  await userEvent.tab({focusTrap: div1})

  expect(checkbox1).toHaveFocus()

  await userEvent.tab({focusTrap: div1})

  expect(radio1).toHaveFocus()

  await userEvent.tab({focusTrap: div1})

  expect(number1).toHaveFocus()

  await userEvent.tab({focusTrap: div1})

  // cycle goes back to first element
  expect(checkbox1).toHaveFocus()

  await userEvent.tab({focusTrap: div2})

  expect(checkbox2).toHaveFocus()

  await userEvent.tab({focusTrap: div2})

  expect(radio2).toHaveFocus()

  await userEvent.tab({focusTrap: div2})

  expect(number2).toHaveFocus()

  await userEvent.tab({focusTrap: div2})

  // cycle goes back to first element
  expect(checkbox2).toHaveFocus()
})

// prior to node 11, Array.sort was unstable for arrays w/ length > 10.
// https://twitter.com/mathias/status/1036626116654637057
// for this reason, the tab() function needs to account for this in it's sorting.
// for example under node 10 in this test:
// > 'abcdefghijklmnopqrstuvwxyz'.split('').sort(() => 0).join('')
// will give you 'nacdefghijklmbopqrstuvwxyz'
test('should support unstable sorting environments like node 10', async () => {
  const letters = 'abcdefghijklmnopqrstuvwxyz'

  setup(`
    <div>
      ${letters
        .split('')
        .map(
          letter => `<input key=${letter} type="text" data-testid=${letter} />`,
        )}
    </div>`)

  expect.assertions(26)

  for (const letter of letters.split('')) {
    await userEvent.tab()
    expect(document.querySelector(`[data-testid="${letter}"]`)).toHaveFocus()
  }
})

test('should not focus disabled elements', async () => {
  setup(`
    <div>
      <input data-testid="one" />
      <input tabIndex="-1" />
      <button disabled>click</button>
      <input disabled />
      <input data-testid="five" />
    </div>`)

  const [one, five] = [
    document.querySelector('[data-testid="one"]'),
    document.querySelector('[data-testid="five"]'),
  ]

  await userEvent.tab()
  expect(one).toHaveFocus()

  await userEvent.tab()
  expect(five).toHaveFocus()
})

test('should keep focus on the document if there are no enabled, focusable elements', async () => {
  setup(`<button disabled>no clicky</button>`)
  await userEvent.tab()
  expect(document.body).toHaveFocus()

  await userEvent.tab({shift: true})
  expect(document.body).toHaveFocus()
})

test('should respect radio groups', async () => {
  setup(`
    <div>
      <input
        data-testid="element"
        type="radio"
        name="first"
        value="first_left"
      />
      <input
        data-testid="element"
        type="radio"
        name="first"
        value="first_right"
      />
      <input
        data-testid="element"
        type="radio"
        name="second"
        value="second_left"
      />
      <input
        data-testid="element"
        type="radio"
        name="second"
        value="second_right"
        checked
      />
    </div>`)

  const [firstLeft, firstRight, , secondRight] = document.querySelectorAll(
    '[data-testid="element"]',
  )

  await userEvent.tab()

  expect(firstLeft).toHaveFocus()

  await userEvent.tab()

  expect(secondRight).toHaveFocus()

  await userEvent.tab({shift: true})

  expect(firstRight).toHaveFocus()
})

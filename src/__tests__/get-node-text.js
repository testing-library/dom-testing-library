import {getNodeText} from '../get-node-text'
import {render} from './helpers/test-utils'

test('it prints out the text content of a container', () => {
  const {container} = render('Hello <!--skipped-->World!')
  expect(getNodeText(container)).toMatchInlineSnapshot(`Hello World!`)
})

test('it prints the value for submit and button inputs', () => {
  const {container} = render(
    '<input type="submit" value="save"><input type="button" value="reset">',
  )

  expect(getNodeText(container.firstChild)).toMatchInlineSnapshot(`save`)

  expect(getNodeText(container.lastChild)).toMatchInlineSnapshot(`reset`)
})

test.each(['submit', 'button', 'reset', 'SUBMIT', 'BUTTON', 'RESET'])(
  'it prints the current value for a %s input',
  type => {
    const {container} = render(`<input type="${type}" value="initial">`)
    const input = container.firstChild
    input.value = 'current'

    expect(getNodeText(input)).toBe('current')
  },
)

test.each(['', 'text', 'invalid', 'submit '])(
  'it does not use the value of an input with type "%s"',
  type => {
    const {container} = render(`<input type="${type}" value="initial">`)

    expect(getNodeText(container.firstChild)).toBe('')
  },
)

test('it only includes direct text nodes for other elements', () => {
  const {container} = render(
    '<button type="submit" value="ignored">Hello <span>nested</span><!-- skipped -->World!</button>',
  )

  expect(getNodeText(container.firstChild)).toBe('Hello World!')
})

test('it prints the value of an input with a namespace prefix', () => {
  const input = document.createElementNS(
    'http://www.w3.org/1999/xhtml',
    'prefix:input',
  )
  input.setAttribute('type', 'submit')
  input.value = 'save'

  expect(getNodeText(input)).toBe('save')
})

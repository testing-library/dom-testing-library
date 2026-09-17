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

test.each(['', '<span>nested</span><!-- skipped -->'])(
  'it returns an empty string when there are no direct text nodes: %s',
  html => {
    const {container} = render(html)

    expect(getNodeText(container)).toBe('')
  },
)

test('it preserves adjacent text nodes, whitespace, and Unicode', () => {
  const {container} = render('')
  for (const text of ['', ' \tA', '\u0301', '\u{1f9ea}', '\nB ', '']) {
    container.appendChild(document.createTextNode(text))
  }

  expect(getNodeText(container)).toBe(' \tA\u0301\u{1f9ea}\nB ')
})

test('it reads changed, removed, and newly added text nodes', () => {
  const {container} = render('')
  const first = document.createTextNode('Hello')
  const second = document.createTextNode(' World')
  container.append(first, second)

  expect(getNodeText(container)).toBe('Hello World')

  first.data = 'Goodbye'
  second.remove()
  container.appendChild(document.createTextNode('!'))

  expect(getNodeText(container)).toBe('Goodbye!')
})

test('it excludes XML CDATA, comments, and processing instructions', () => {
  const xml = document.implementation.createDocument(null, 'root')
  const container = xml.documentElement
  container.append(
    xml.createTextNode('before'),
    xml.createCDATASection('skipped'),
    xml.createComment('skipped'),
    xml.createProcessingInstruction('test', 'skipped'),
    xml.createTextNode('after'),
  )

  expect(getNodeText(container)).toBe('beforeafter')
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

import {configure} from '../config'
import {renderIntoDocument} from './helpers/test-utils'
import {screen} from '..'

beforeEach(() => {
  configure({showSuggestions: true})
})

it('should not suggest when using getByRole', () => {
  renderIntoDocument(`<button data-testid="foo">submit</button>`)

  expect(() => screen.getByRole('button', {name: /submit/})).not.toThrowError()
})

test('should not suggest when nothing available', () => {
  renderIntoDocument(`<span data-testid="foo" />`)

  expect(() => screen.queryByTestId('foo')).not.toThrowError()
})

test(`should not suggest if the suggestion would give different results`, () => {
  renderIntoDocument(`
    <input type="text" data-testid="foo" /><span data-testid="foo" />
  `)

  expect(() => screen.getAllByTestId('foo')).not.toThrowError()
})

test('should suggest getByRole when used with getBy', () => {
  renderIntoDocument(`<button data-testid="foo">submit</button>`)

  expect(() => screen.getByTestId('foo')).toThrowErrorMatchingInlineSnapshot(`
"A better query is available, try this:
*ByRole("button", {name:/submit/})


<body>
  <button
    data-testid="foo"
  >
    submit
  </button>
</body>"
`)
})

test('should suggest *ByRole when used with getAllBy', () => {
  renderIntoDocument(`
    <button data-testid="foo">submit</button>
    <button data-testid="foo">submit</button>`)

  expect(() => screen.getAllByTestId('foo'))
    .toThrowErrorMatchingInlineSnapshot(`
"A better query is available, try this:
*ByRole("button", {name:/submit/})


<body>
  
    
  <button
    data-testid="foo"
  >
    submit
  </button>
  
    
  <button
    data-testid="foo"
  >
    submit
  </button>
</body>"
`)
})

test('should suggest *ByLabelText when no role available', () => {
  renderIntoDocument(
    `<label for="foo">Username</label><input data-testid="foo" id="foo" />`,
  )
  expect(() => screen.getByTestId('foo')).toThrowError(
    /\*ByLabelText\("Username"\)/,
  )
})

test(`should suggest *ByLabel on non form elements`, () => {
  renderIntoDocument(`
  <div data-testid="foo" aria-labelledby="section-one-header">
    <span id="section-one-header">Section One</span>
    <p>some content</p>
  </div>
  `)

  expect(() => screen.getByTestId('foo')).toThrowError(
    /\*ByLabelText\("Section One"\)/,
  )
})

test.each([
  `<label id="username-label">Username</label><input aria-labelledby="username-label" type="text" />`,
  `<label><span>Username</span><input type="text" /></label>`,
  `<label for="foo">Username</label><input id="foo" type="text" />`,
])('should suggest *ByRole over label %s', html => {
  renderIntoDocument(html)

  expect(() => screen.getByLabelText('Username')).toThrowError(
    /\*ByRole\("textbox", \{name:\/Username\/\}\)/,
  )
})

test(`should suggest *ByText for simple elements`, () => {
  renderIntoDocument(`<div data-testid="foo">hello there</div>`)

  expect(() => screen.getByTestId('foo')).toThrowError(
    /\*ByText\("hello there"\)/,
  )
})

test(`should suggest *ByDisplayValue`, () => {
  renderIntoDocument(`<input id="lastName" data-testid="lastName" />`)

  document.getElementById('lastName').value = 'Prine' // RIP John Prine

  expect(() => screen.getByTestId('lastName')).toThrowError(
    /\*ByDisplayValue\("Prine"\)/,
  )
})

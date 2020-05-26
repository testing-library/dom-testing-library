import {configure} from '../config'
import {screen} from '..'
import {renderIntoDocument} from './helpers/test-utils'

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

test('should suggest img role w/ alt text', () => {
  renderIntoDocument(`<img data-testid="img" alt="Incredibles 2 Poster"  />`)

  expect(() => screen.getByAltText('Incredibles 2 Poster')).toThrowError(
    /\*ByRole\("img", \{name:\/Incredibles 2 Poster\/\}\)/,
  )
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

test(`should suggest *ByPlaceholderText`, () => {
  renderIntoDocument(`<input data-testid="foo" placeholder="Username" />`)

  expect(() => screen.getByTestId('foo')).toThrowError(
    /\*ByPlaceholderText\("Username"\)/,
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

test(`should suggest *ByAltText`, () => {
  renderIntoDocument(`
    <input data-testid="input" alt="last name" />
    <map name="workmap">
      <area data-testid="area" shape="rect" coords="34,44,270,350" alt="Computer">
    </map>
    `)

  expect(() => screen.getByTestId('input')).toThrowError(
    /\*ByAltText\("last name"\)/,
  )
  expect(() => screen.getByTestId('area')).toThrowError(
    /\*ByAltText\("Computer"\)/,
  )
})

test(`should suggest *ByTitle`, () => {
  renderIntoDocument(`
  <span title="Delete" data-testid="delete"></span>
  <svg>
    <title data-testid="svg">Close</title>
    <g><path /></g>
  </svg>`)

  expect(() => screen.getByTestId('delete')).toThrowError(
    /\*ByTitle\("Delete"\)/,
  )

  //Since `ByTitle` and `ByText` will both return the <title> element
  //`getByText` will always be the suggested query as it is higher up the list.
  expect(() => screen.getByTestId('svg')).toThrowError(/\*ByText\("Close"\)/)
})

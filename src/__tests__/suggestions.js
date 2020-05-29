import {configure} from '../config'
import {screen} from '..'
import {renderIntoDocument} from './helpers/test-utils'

beforeAll(() => {
  configure({showSuggestions: true})
})

afterAll(() => {
  configure({showSuggestions: false})
})

test('does not suggest when using getByRole', () => {
  renderIntoDocument(`<button data-testid="foo">submit</button>`)

  expect(() => screen.getByRole('button', {name: /submit/i})).not.toThrowError()
})

test('should not suggest when nothing available', () => {
  renderIntoDocument(`<span data-testid="foo" />`)

  expect(() => screen.queryByTestId('foo')).not.toThrowError()
})

test(`should not suggest if the suggestion would give different results`, () => {
  renderIntoDocument(`
    <input type="text" data-testid="foo" /><span data-testid="foo" />
  `)

  expect(() =>
    screen.getAllByTestId('foo', {suggest: false}),
  ).not.toThrowError()
})

test('should not suggest if there would be mixed suggestions', () => {
  renderIntoDocument(`
  <button data-testid="foo">submit</button>
  <label for="foo">Username</label><input data-testid="foo" id="foo" />`)

  expect(() => screen.getAllByTestId('foo')).not.toThrowError()
})

test('should not suggest when suggest is turned off for a query', () => {
  renderIntoDocument(`
  <button data-testid="foo">submit</button>
  <button data-testid="foot">another</button>`)

  expect(() => screen.getByTestId('foo', {suggest: false})).not.toThrowError()
  expect(() =>
    screen.getAllByTestId(/foo/, {suggest: false}),
  ).not.toThrowError()
})

test('should suggest getByRole when used with getBy', () => {
  renderIntoDocument(`<button data-testid="foo">submit</button>`)

  expect(() => screen.getByTestId('foo')).toThrowErrorMatchingInlineSnapshot(`
"A better query is available, try this:
getByRole("button", {name: /submit/i})


<body>
  <button
    data-testid="foo"
  >
    submit
  </button>
</body>"
`)
})

test('should suggest getAllByRole when used with getAllByTestId', () => {
  renderIntoDocument(`
    <button data-testid="foo">submit</button>
    <button data-testid="foo">submit</button>`)

  expect(() => screen.getAllByTestId('foo'))
    .toThrowErrorMatchingInlineSnapshot(`
"A better query is available, try this:
getAllByRole("button", {name: /submit/i})


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
    /getByRole\("img", \{name: \/incredibles 2 poster\/i\}\)/,
  )
})

test('should suggest getByLabelText when no role available', () => {
  renderIntoDocument(
    `<label for="foo">Username</label><input data-testid="foo" id="foo" />`,
  )
  expect(() => screen.getByTestId('foo')).toThrowError(
    /getByLabelText\("Username"\)/,
  )
})

test(`should suggest getByLabel on non form elements`, () => {
  renderIntoDocument(`
  <div data-testid="foo" aria-labelledby="section-one-header">
    <span id="section-one-header">Section One</span>
    <p>some content</p>
  </div>
  `)

  expect(() => screen.getByTestId('foo')).toThrowError(
    /getByLabelText\("Section One"\)/,
  )
})

test.each([
  `<label id="username-label">Username</label><input aria-labelledby="username-label" type="text" />`,
  `<label><span>Username</span><input type="text" /></label>`,
  `<label for="foo">Username</label><input id="foo" type="text" />`,
])('should suggest getByRole over label %s', html => {
  renderIntoDocument(html)

  expect(() => screen.getByLabelText('Username')).toThrowError(
    /getByRole\("textbox", \{name: \/username\/i\}\)/,
  )
})

test(`should suggest getByPlaceholderText`, () => {
  renderIntoDocument(`<input data-testid="foo" placeholder="Username" />`)

  expect(() => screen.getByTestId('foo')).toThrowError(
    /getByPlaceholderText\("Username"\)/,
  )
})

test(`should suggest getByText for simple elements`, () => {
  renderIntoDocument(`<div data-testid="foo">hello there</div>`)

  expect(() => screen.getByTestId('foo')).toThrowError(
    /getByText\("hello there"\)/,
  )
})

test(`should suggest getByDisplayValue`, () => {
  renderIntoDocument(`<input id="lastName" data-testid="lastName" />`)

  document.getElementById('lastName').value = 'Prine' // RIP John Prine

  expect(() => screen.getByTestId('lastName')).toThrowError(
    /getByDisplayValue\("Prine"\)/,
  )
})

test(`should suggest getByAltText`, () => {
  renderIntoDocument(`
    <input data-testid="input" alt="last name" />
    <map name="workmap">
      <area data-testid="area" shape="rect" coords="34,44,270,350" alt="Computer">
    </map>
    `)

  expect(() => screen.getByTestId('input')).toThrowError(
    /getByAltText\("last name"\)/,
  )
  expect(() => screen.getByTestId('area')).toThrowError(
    /getByAltText\("Computer"\)/,
  )
})

test(`should suggest getByTitle`, () => {
  renderIntoDocument(`
  <span title="Delete" data-testid="delete"></span>
  <svg>
    <title data-testid="svg">Close</title>
    <g><path /></g>
  </svg>`)

  expect(() => screen.getByTestId('delete')).toThrowError(
    /getByTitle\("Delete"\)/,
  )

  // Since `ByTitle` and `ByText` will both return the <title> element
  // `getByText` will always be the suggested query as it is higher up the list.
  expect(() => screen.getByTestId('svg')).toThrowError(/getByText\("Close"\)/)
})

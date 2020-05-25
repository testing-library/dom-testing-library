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
  renderIntoDocument(`<label for="foo">Username</label><input id="foo" />`)
})

it('should suggest *ByRole when even if label is available', () => {
  renderIntoDocument(
    `<label for="foo">Username</label><input id="foo" type="text" />`,
  )

  expect(() => screen.getByLabelText('Username')).toThrowError(
    /\*ByRole\("textbox", \{name:\/Username\/\}\)/g,
  )
})

import {screen} from '../'
import {getSuggestedQuery} from '../suggestions'
import {renderIntoDocument} from './helpers/test-utils'

describe('Unable to suggest', () => {
  it('should not recommend anything on empty span', () => {
    const {container} = renderIntoDocument(`<span />`)

    const element = container.firstChild
    expect(getSuggestedQuery({element})).not.toBeDefined()
  })

  it('should not recommend PlaceholderText on input with empty placeholder', () => {
    renderIntoDocument(`<input placeholder="" data-testid="foo" />`)

    const element = screen.getByTestId('foo')

    expect(getSuggestedQuery({element})).not.toBeDefined()
  })
})

describe('Role', () => {
  it('should recommend role for element with text', () => {
    renderIntoDocument(`<button data-testid="foo">submit</button>`)

    const element = screen.getByTestId('foo') //omg the hypocrisy
    const results = getSuggestedQuery({element})
    expect(results.toString()).toBe(`Role("button", {name:/submit/})`)

    expect(results).toEqual(
      expect.objectContaining({
        queryName: 'Role',
        role: 'button',
        textContent: 'submit',
      }),
    )
  })

  it('should recommend role on element without text', () => {
    renderIntoDocument(`<input type="checkbox" />`)

    const element = screen.getByRole('checkbox')
    const results = getSuggestedQuery({element})
    expect(results.toString()).toBe(`Role("checkbox")`)

    expect(results).toEqual(
      expect.objectContaining({
        queryName: 'Role',
        role: 'checkbox',
        textContent: '',
      }),
    )
  })
})

describe('Form Fields (role not present)', () => {
  it('should recommend LabelText on input', () => {
    renderIntoDocument(
      `<label for="username">Username</label><input id="username"  />`,
    )

    const element = screen.getByLabelText('Username')

    const results = getSuggestedQuery({element})
    expect(results.toString()).toBe(`LabelText("Username")`)
    expect(results).toEqual(
      expect.objectContaining({
        queryName: 'LabelText',
        textContent: 'Username',
      }),
    )
  })

  it('should recommend LabelText on nested input', () => {
    renderIntoDocument(`<label><span>Username</span><input /></label>`)

    const element = screen.getByLabelText('Username')

    const results = getSuggestedQuery({element})
    expect(results.toString()).toBe(`LabelText("Username")`)
    expect(results).toEqual(
      expect.objectContaining({
        queryName: 'LabelText',
        textContent: 'Username',
      }),
    )
  })

  it('should recommend PlaceholderText on input', () => {
    renderIntoDocument(`<input placeholder="Username" />`)

    const element = screen.getByPlaceholderText('Username')

    const results = getSuggestedQuery({element})
    expect(results.toString()).toBe(`PlaceholderText("Username")`)
    expect(results).toEqual(
      expect.objectContaining({
        queryName: 'PlaceholderText',
        textContent: 'Username',
      }),
    )
  })
})

it('should recommend Text', () => {
  renderIntoDocument(`<div>hello there</div>`)

  const element = screen.getByText('hello there')
  const results = getSuggestedQuery({element})

  expect(results.toString()).toBe(`Text("hello there")`)
  expect(results).toEqual(
    expect.objectContaining({
      queryName: 'Text',
      textContent: 'hello there',
    }),
  )
})

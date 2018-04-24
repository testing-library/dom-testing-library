import 'jest-dom/extend-expect'
import {render} from './helpers/test-utils'

test('query can return null', () => {
  const {
    queryByLabelText,
    queryByPlaceholderText,
    queryByText,
    queryByTestId,
    queryByAltText,
  } = render('<div />')
  expect(queryByTestId('LucyRicardo')).toBeNull()
  expect(queryByLabelText('LucyRicardo')).toBeNull()
  expect(queryByPlaceholderText('LucyRicardo')).toBeNull()
  expect(queryByText('LucyRicardo')).toBeNull()
  expect(queryByAltText('LucyRicardo')).toBeNull()
})

test('get throws a useful error message', () => {
  const {
    getByLabelText,
    getByPlaceholderText,
    getByText,
    getByTestId,
    getByAltText,
  } = render('<div />')
  expect(() => getByLabelText('LucyRicardo')).toThrowErrorMatchingSnapshot()
  expect(() =>
    getByPlaceholderText('LucyRicardo'),
  ).toThrowErrorMatchingSnapshot()
  expect(() => getByText('LucyRicardo')).toThrowErrorMatchingSnapshot()
  expect(() => getByTestId('LucyRicardo')).toThrowErrorMatchingSnapshot()
  expect(() => getByAltText('LucyRicardo')).toThrowErrorMatchingSnapshot()
})

test('can get elements by matching their text content', () => {
  const {queryByText} = render(`
    <div>
      <span>Currently showing</span>
      <span>
        Step
        1
          of 4
      </span>
    </div>
  `)
  expect(queryByText('Currently showing')).toBeInTheDOM()
  expect(queryByText('Step 1 of 4')).toBeInTheDOM()
})

test('matches case with RegExp matcher', () => {
  const {queryByText} = render(`
    <span>STEP 1 of 4</span>
  `)
  expect(queryByText(/STEP 1 of 4/)).toBeInTheDOM()
  expect(queryByText(/Step 1 of 4/)).not.toBeInTheDOM()
})

test('get can get form controls by label text', () => {
  const {getByLabelText} = render(`
    <div>
      <label>
        1st<input id="first-id" />
      </label>
      <div>
        <label for="second-id">2nd</label>
        <input id="second-id" />
      </div>
      <div>
        <label id="third-label">3rd</label>
        <input aria-labelledby="third-label" id="third-id" />
      </div>
      <div>
        <label for="fourth.id">4th</label>
        <input id="fourth.id" />
      </div>
    </div>
  `)
  expect(getByLabelText('1st').id).toBe('first-id')
  expect(getByLabelText('2nd').id).toBe('second-id')
  expect(getByLabelText('3rd').id).toBe('third-id')
  expect(getByLabelText('4th').id).toBe('fourth.id')
})

test('get can get form controls by placeholder', () => {
  const {getByPlaceholderText} = render(`
    <input id="username-id" placeholder="username" />,
  `)
  expect(getByPlaceholderText('username').id).toBe('username-id')
})

test('label with no form control', () => {
  const {getByLabelText, queryByLabelText} = render(`<label>All alone</label>`)
  expect(queryByLabelText('alone')).toBeNull()
  expect(() => getByLabelText('alone')).toThrowErrorMatchingSnapshot()
})

test('totally empty label', () => {
  const {getByLabelText, queryByLabelText} = render(`<label />`)
  expect(queryByLabelText('')).toBeNull()
  expect(() => getByLabelText('')).toThrowErrorMatchingSnapshot()
})

test('getByLabelText with aria-label', () => {
  // not recommended normally, but supported for completeness
  const {queryByLabelText} = render(`<input aria-label="batman" />`)
  expect(queryByLabelText('bat')).toBeInTheDOM()
})

test('get element by its alt text', () => {
  const {getByAltText} = render(`
    <div>
      <input data-info="no alt here" />
      <img alt="finding nemo poster" src="/finding-nemo.png" />
    </div>,
  `)
  expect(getByAltText(/fin.*nem.*poster$/i).src).toBe('/finding-nemo.png')
})

test('getAll* matchers return an array', () => {
  const {
    getAllByAltText,
    getAllByTestId,
    getAllByLabelText,
    getAllByPlaceholderText,
    getAllByText,
  } = render(`
    <div>
      <img
        data-testid="poster"
        alt="finding nemo poster" 
        src="/finding-nemo.png" />
      <img
        data-testid="poster"
        alt="finding dory poster" 
        src="/finding-dory.png" />
      <img
        data-testid="poster"
        alt="jumanji poster" 
        src="/jumanji.png" />
      <p>Where to next?</p>
      <label for="username">User Name</label>
      <input id="username" placeholder="Dwayne 'The Rock' Johnson" />
    </div>,
  `)
  expect(getAllByAltText(/finding.*poster$/i)).toHaveLength(2)
  expect(getAllByAltText('jumanji')).toHaveLength(1)
  expect(getAllByTestId('poster')).toHaveLength(3)
  expect(getAllByPlaceholderText(/The Rock/)).toHaveLength(1)
  expect(getAllByLabelText('User Name')).toHaveLength(1)
  expect(getAllByText('where')).toHaveLength(1)
})

test('getAll* matchers throw for 0 matches', () => {
  const {
    getAllByAltText,
    getAllByTestId,
    getAllByLabelText,
    getAllByPlaceholderText,
    getAllByText,
  } = render(`
    <div>
      <label>No Matches Please</label>
    </div>,
  `)
  expect(() => getAllByTestId('nope')).toThrow()
  expect(() => getAllByAltText('nope')).toThrow()
  expect(() => getAllByLabelText('nope')).toThrow()
  expect(() => getAllByLabelText('no matches please')).toThrow()
  expect(() => getAllByPlaceholderText('nope')).toThrow()
  expect(() => getAllByText('nope')).toThrow()
})

test('queryAll* matchers return an array for 0 matches', () => {
  const {
    queryAllByAltText,
    queryAllByTestId,
    queryAllByLabelText,
    queryAllByPlaceholderText,
    queryAllByText,
  } = render(`
    <div>
    </div>,
  `)
  expect(queryAllByTestId('nope')).toHaveLength(0)
  expect(queryAllByAltText('nope')).toHaveLength(0)
  expect(queryAllByLabelText('nope')).toHaveLength(0)
  expect(queryAllByPlaceholderText('nope')).toHaveLength(0)
  expect(queryAllByText('nope')).toHaveLength(0)
})

test('using jest helpers to assert element states', () => {
  const {queryByTestId} = render(`<span data-testid="count-value">2</span>`)

  // other ways to assert your test cases, but you don't need all of them.
  expect(queryByTestId('count-value')).toBeInTheDOM()
  expect(queryByTestId('count-value1')).not.toBeInTheDOM()
  expect(queryByTestId('count-value')).toHaveTextContent('2')
  expect(queryByTestId('count-value')).not.toHaveTextContent('21')
  expect(() =>
    expect(queryByTestId('count-value2')).toHaveTextContent('2'),
  ).toThrowError()

  // negative test cases wrapped in throwError assertions for coverage.
  expect(() =>
    expect(queryByTestId('count-value')).not.toBeInTheDOM(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('count-value1')).toBeInTheDOM(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('count-value')).toHaveTextContent('3'),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('count-value')).not.toHaveTextContent('2'),
  ).toThrowError()

  expect(() =>
    expect({thisIsNot: 'an html element'}).toBeInTheDOM(),
  ).toThrowError()
})

test('using jest helpers to check element attributes', () => {
  const {getByTestId} = render(`
    <button data-testid="ok-button" type="submit" disabled>
      OK
    </button>
  `)

  expect(getByTestId('ok-button')).toHaveAttribute('disabled')
  expect(getByTestId('ok-button')).toHaveAttribute('type')
  expect(getByTestId('ok-button')).not.toHaveAttribute('class')
  expect(getByTestId('ok-button')).toHaveAttribute('type', 'submit')
  expect(getByTestId('ok-button')).not.toHaveAttribute('type', 'button')

  expect(() =>
    expect(getByTestId('ok-button')).not.toHaveAttribute('disabled'),
  ).toThrowError()
  expect(() =>
    expect(getByTestId('ok-button')).not.toHaveAttribute('type'),
  ).toThrowError()
  expect(() =>
    expect(getByTestId('ok-button')).toHaveAttribute('class'),
  ).toThrowError()
  expect(() =>
    expect(getByTestId('ok-button')).not.toHaveAttribute('type', 'submit'),
  ).toThrowError()
  expect(() =>
    expect(getByTestId('ok-button')).toHaveAttribute('type', 'button'),
  ).toThrowError()
})

test('using jest helpers to check element class names', () => {
  const {getByTestId} = render(`
    <div>
      <button data-testid="delete-button" class="btn extra btn-danger">
        Delete item
      </button>
      <button data-testid="cancel-button">
        Cancel
      </button>
    </div>
  `)

  expect(getByTestId('delete-button')).toHaveClass('btn')
  expect(getByTestId('delete-button')).toHaveClass('btn-danger')
  expect(getByTestId('delete-button')).toHaveClass('extra')
  expect(getByTestId('delete-button')).not.toHaveClass('xtra')
  expect(getByTestId('delete-button')).toHaveClass('btn btn-danger')
  expect(getByTestId('delete-button')).not.toHaveClass('btn-link')
  expect(getByTestId('cancel-button')).not.toHaveClass('btn-danger')

  expect(() =>
    expect(getByTestId('delete-button')).not.toHaveClass('btn'),
  ).toThrowError()
  expect(() =>
    expect(getByTestId('delete-button')).not.toHaveClass('btn-danger'),
  ).toThrowError()
  expect(() =>
    expect(getByTestId('delete-button')).not.toHaveClass('extra'),
  ).toThrowError()
  expect(() =>
    expect(getByTestId('delete-button')).toHaveClass('xtra'),
  ).toThrowError()
  expect(() =>
    expect(getByTestId('delete-button')).not.toHaveClass('btn btn-danger'),
  ).toThrowError()
  expect(() =>
    expect(getByTestId('delete-button')).toHaveClass('btn-link'),
  ).toThrowError()
  expect(() =>
    expect(getByTestId('cancel-button')).toHaveClass('btn-danger'),
  ).toThrowError()
})

test('test the debug helper prints the dom state here', () => {
  const originalDebugPrintLimit = process.env.DEBUG_PRINT_LIMIT
  const Large = `<div>
        ${Array.from({length: 7000}, (v, key) => key).map(() => {
          return `<div data-testid="debugging" data-otherid="debugging">
                Hello World!
            </div>`
        })}
    </div>`

  const {getByText} = render(Large) // render large DOM which exceeds 7000 limit
  expect(() => expect(getByText('not present')).toBeInTheDOM()).toThrowError()

  const Hello = `<div data-testid="debugging" data-otherid="debugging">
        Hello World!
    </div>`
  const {getByTestId} = render(Hello)
  process.env.DEBUG_PRINT_LIMIT = 5 // user should see `...`
  expect(() => expect(getByTestId('not present')).toBeInTheDOM()).toThrowError(
    /\.\.\./,
  )

  const {getByLabelText} = render(Hello)
  process.env.DEBUG_PRINT_LIMIT = 10000 // user shouldn't see `...`
  expect(() =>
    expect(getByLabelText('not present')).toBeInTheDOM(/^((?!\.\.\.).)*$/),
  ).toThrowError()

  //all good replacing it with old value
  process.env.DEBUG_PRINT_LIMIT = originalDebugPrintLimit
})

/* eslint jsx-a11y/label-has-for:0 */

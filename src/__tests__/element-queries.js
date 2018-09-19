import 'jest-dom/extend-expect'
import {render} from './helpers/test-utils'

beforeEach(() => {
  window.Cypress = null
})

test('query can return null', () => {
  const {
    queryByLabelText,
    queryBySelectText,
    queryByPlaceholderText,
    queryByText,
    queryByTestId,
    queryByAltText,
  } = render('<div />')
  expect(queryByTestId('LucyRicardo')).toBeNull()
  expect(queryByLabelText('LucyRicardo')).toBeNull()
  expect(queryBySelectText('LucyRicardo')).toBeNull()
  expect(queryByPlaceholderText('LucyRicardo')).toBeNull()
  expect(queryByText('LucyRicardo')).toBeNull()
  expect(queryByAltText('LucyRicardo')).toBeNull()
})

test('get throws a useful error message', () => {
  const {
    getByLabelText,
    getBySelectText,
    getByPlaceholderText,
    getByText,
    getByTestId,
    getByAltText,
    getByTitle,
    getByValue,
    getByRole,
  } = render('<div />')
  expect(() => getByLabelText('LucyRicardo')).toThrowErrorMatchingSnapshot()
  expect(() => getBySelectText('LucyRicardo')).toThrowErrorMatchingSnapshot()
  expect(() =>
    getByPlaceholderText('LucyRicardo'),
  ).toThrowErrorMatchingSnapshot()
  expect(() => getByText('LucyRicardo')).toThrowErrorMatchingSnapshot()
  expect(() => getByTestId('LucyRicardo')).toThrowErrorMatchingSnapshot()
  expect(() => getByAltText('LucyRicardo')).toThrowErrorMatchingSnapshot()
  expect(() => getByTitle('LucyRicardo')).toThrowErrorMatchingSnapshot()
  expect(() => getByValue('LucyRicardo')).toThrowErrorMatchingSnapshot()
  expect(() => getByRole('LucyRicardo')).toThrowErrorMatchingSnapshot()
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
  expect(queryByText('Currently showing')).toBeTruthy()
  expect(queryByText('Step 1 of 4')).toBeTruthy()
})

test('can get elements by matching their text across adjacent text nodes', () => {
  const textDiv = document.createElement('div')
  const textNodeContent = ['£', '24', '.', '99']
  textNodeContent
    .map(text => document.createTextNode(text))
    .forEach(textNode => textDiv.appendChild(textNode))

  const {container, queryByText} = render('<div />')
  container.appendChild(textDiv)
  expect(queryByText('£24.99')).toBeTruthy()
})

test('matches case with RegExp matcher', () => {
  const {queryByText} = render(`
    <span>STEP 1 of 4</span>
  `)
  expect(queryByText(/STEP 1 of 4/)).toBeTruthy()
  expect(queryByText(/Step 1 of 4/)).not.toBeTruthy()
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
      <div>
      <div>
        <label id="fifth-label-one">5th one</label>
        <label id="fifth-label-two">5th two</label>
        <input aria-labelledby="fifth-label-one fifth-label-two" id="fifth-id" />
      </div>
    </div>
  `)
  expect(getByLabelText('1st').id).toBe('first-id')
  expect(getByLabelText('2nd').id).toBe('second-id')
  expect(getByLabelText('3rd').id).toBe('third-id')
  expect(getByLabelText('4th').id).toBe('fourth.id')
  expect(getByLabelText('5th one').id).toBe('fifth-id')
  expect(getByLabelText('5th two').id).toBe('fifth-id')
})

test('get can get form controls by placeholder', () => {
  const {getByPlaceholderText} = render(`
    <input id="username-id" placeholder="username" />,
  `)
  expect(getByPlaceholderText('username').id).toBe('username-id')
})

test('label with no form control', () => {
  const {getByLabelText, queryByLabelText} = render(`<label>All alone</label>`)
  expect(queryByLabelText(/alone/)).toBeNull()
  expect(() => getByLabelText(/alone/)).toThrowErrorMatchingSnapshot()
})

test('totally empty label', () => {
  const {getByLabelText, queryByLabelText} = render(`<label />`)
  expect(queryByLabelText('')).toBeNull()
  expect(() => getByLabelText('')).toThrowErrorMatchingSnapshot()
})

test('getByLabelText with aria-label', () => {
  // not recommended normally, but supported for completeness
  const {queryByLabelText} = render(`<input aria-label="batman" />`)
  expect(queryByLabelText(/bat/)).toBeTruthy()
})

test('get element by its alt text', () => {
  const {getByAltText} = render(`
    <div>
      <input data-info="no alt here" />
      <img alt="finding nemo poster" src="/finding-nemo.png" />
    </div>,
  `)
  expect(getByAltText(/fin.*nem.*poster$/i).src).toBe(
    'http://localhost/finding-nemo.png',
  )
})

test('query/get element by its title', () => {
  const {getByTitle, queryByTitle} = render(`
    <div>
        <span title="Ignore this" id="1"/>
        <span title="Delete" id="2"/>
        <span title="Ignore this as well" id="3"/>
    </div>
  `)

  expect(getByTitle('Delete').id).toEqual('2')
  expect(queryByTitle('Delete').id).toEqual('2')
  expect(queryByTitle('Del', {exact: false}).id).toEqual('2')
})

test('query/get title element of SVG', () => {
  const {getByTitle, queryByTitle} = render(`
    <div>
        <svg>
            <title id="svg-title">Close</title>
            <g>
              <path />
            </g>
        </svg>
    </div>
  `)

  expect(getByTitle('Close').id).toEqual('svg-title')
  expect(queryByTitle('Close').id).toEqual('svg-title')
})

test('query/get element by its value', () => {
  const {getByValue, queryByValue} = render(`
  <div>
    <input placeholder="name" type="text"/>
    <input placeholder="lastname" type="text" value="Norris"/>
    <input placeholder="email" type="text"/>
  </div>
  `)

  expect(getByValue('Norris').placeholder).toEqual('lastname')
  expect(queryByValue('Norris').placeholder).toEqual('lastname')
})

test('query/get select by text with the default option selected', () => {
  const {getBySelectText, queryBySelectText} = render(`
  <select id="state-select">
    <option value="">State</option>
    <option value="AL">Alabama</option>
    <option value="AK" >Alaska</option>
    <option value="AZ">Arizona</option>
  </select>
  `)

  expect(getBySelectText('State').id).toEqual('state-select')
  expect(queryBySelectText('State').id).toEqual('state-select')
})

test('query/get select by text with one option selected', () => {
  const {getBySelectText, queryBySelectText} = render(`
  <select id="state-select">
    <option value="">State</option>
    <option value="AL">Alabama</option>
    <option selected value="AK" >Alaska</option>
    <option value="AZ">Arizona</option>
  </select>
  `)

  expect(getBySelectText('Alaska').id).toEqual('state-select')
  expect(queryBySelectText('Alaska').id).toEqual('state-select')
})

test('query/get select by text with multiple options selected', () => {
  const {getBySelectText, queryBySelectText} = render(`
  <select multiple id="state-select">
    <option value="">State</option>
    <option selected value="AL">Alabama</option>
    <option selected value="AK" >Alaska</option>
    <option value="AZ">Arizona</option>
  </select>
  `)

  expect(getBySelectText('Alabama').id).toEqual('state-select')
  expect(queryBySelectText('Alaska').id).toEqual('state-select')
})

test('can get elements by data-testid attribute', () => {
  const {queryByTestId} = render(`<div data-testid="firstName"></div>`)
  expect(queryByTestId('firstName')).toBeTruthy()
  expect(queryByTestId(/first/)).toBeTruthy()
  expect(queryByTestId(testid => testid === 'firstName')).toBeTruthy()
  // match should be exact, case-sensitive
  expect(queryByTestId('firstname')).not.toBeTruthy()
  expect(queryByTestId('first')).not.toBeTruthy()
  expect(queryByTestId('firstNamePlusMore')).not.toBeTruthy()
  expect(queryByTestId('first-name')).not.toBeTruthy()
})

test('getAll* matchers return an array', () => {
  const {
    getAllByAltText,
    getAllByTestId,
    getAllByLabelText,
    getAllBySelectText,
    getAllByPlaceholderText,
    getAllByText,
    getAllByRole,
  } = render(`
    <div role="container">
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
      <select>
        <option value="">German cars</option>
        <option value="volvo">BMW</option>
        <option value="audi">Audi</option>
      </select>
      <select>
        <option value="">Japanese cars</option>
        <option value="volvo">Toyota</option>
        <option value="audi">Honda</option>
      </select>
    </div>,
  `)
  expect(getAllByAltText(/finding.*poster$/i)).toHaveLength(2)
  expect(getAllByAltText(/jumanji/)).toHaveLength(1)
  expect(getAllByTestId('poster')).toHaveLength(3)
  expect(getAllByPlaceholderText(/The Rock/)).toHaveLength(1)
  expect(getAllByLabelText('User Name')).toHaveLength(1)
  expect(getAllBySelectText('Japanese cars')).toHaveLength(1)
  expect(getAllBySelectText(/cars$/)).toHaveLength(2)
  expect(getAllByText(/^where/i)).toHaveLength(1)
  expect(getAllByRole(/container/i)).toHaveLength(1)
})

test('getAll* matchers throw for 0 matches', () => {
  const {
    getAllByAltText,
    getAllByTestId,
    getAllByLabelText,
    getAllBySelectText,
    getAllByPlaceholderText,
    getAllByText,
    getAllByRole,
  } = render(`
    <div role="container">
      <label>No Matches Please</label>
    </div>,
  `)
  expect(() => getAllByTestId('nope')).toThrow()
  expect(() => getAllByTestId('abc')).toThrow()
  expect(() => getAllByAltText('nope')).toThrow()
  expect(() => getAllByLabelText('nope')).toThrow()
  expect(() => getAllByLabelText('no matches please')).toThrow()
  expect(() => getAllBySelectText('nope')).toThrow()
  expect(() => getAllByPlaceholderText('nope')).toThrow()
  expect(() => getAllByText('nope')).toThrow()
  expect(() => getAllByRole('nope')).toThrow()
})

test('queryAll* matchers return an array for 0 matches', () => {
  const {
    queryAllByAltText,
    queryAllByTestId,
    queryAllByLabelText,
    queryAllBySelectText,
    queryAllByPlaceholderText,
    queryAllByText,
    queryAllByRole,
  } = render(`
    <div>
    </div>,
  `)
  expect(queryAllByTestId('nope')).toHaveLength(0)
  expect(queryAllByAltText('nope')).toHaveLength(0)
  expect(queryAllByLabelText('nope')).toHaveLength(0)
  expect(queryAllBySelectText('nope')).toHaveLength(0)
  expect(queryAllByPlaceholderText('nope')).toHaveLength(0)
  expect(queryAllByText('nope')).toHaveLength(0)
  expect(queryAllByRole('nope')).toHaveLength(0)
})

test('using jest helpers to assert element states', () => {
  const {queryByTestId} = render(`<span data-testid="count-value">2</span>`)

  // other ways to assert your test cases, but you don't need all of them.
  expect(queryByTestId('count-value')).toBeTruthy()
  expect(queryByTestId('count-value1')).not.toBeTruthy()
  expect(queryByTestId('count-value')).toHaveTextContent('2')
  expect(queryByTestId('count-value')).not.toHaveTextContent('21')
  expect(() =>
    expect(queryByTestId('count-value2')).toHaveTextContent('2'),
  ).toThrowError()

  // negative test cases wrapped in throwError assertions for coverage.
  expect(() =>
    expect(queryByTestId('count-value')).not.toBeTruthy(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('count-value1')).toBeTruthy(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('count-value')).toHaveTextContent('3'),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('count-value')).not.toHaveTextContent('2'),
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

test('using jest helpers to check element role', () => {
  const {getByRole} = render(`
    <div role="dialog">
      <span>Contents</span>
    </div>
  `)

  expect(getByRole('dialog')).toHaveTextContent('Contents')
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
  expect(() => expect(getByText('not present')).toBeTruthy()).toThrowError()

  const Hello = `<div data-testid="debugging" data-otherid="debugging">
        Hello World!
    </div>`
  const {getByTestId} = render(Hello)
  process.env.DEBUG_PRINT_LIMIT = 5 // user should see `...`
  expect(() => expect(getByTestId('not present')).toBeTruthy()).toThrowError(
    /\.\.\./,
  )

  const {getByLabelText} = render(Hello)
  process.env.DEBUG_PRINT_LIMIT = 10000 // user shouldn't see `...`
  expect(() =>
    expect(getByLabelText('not present')).toBeTruthy(/^((?!\.\.\.).)*$/),
  ).toThrowError()

  //all good replacing it with old value
  process.env.DEBUG_PRINT_LIMIT = originalDebugPrintLimit
})

test('get throws a useful error message without DOM in Cypress', () => {
  window.Cypress = {}
  const {
    getByLabelText,
    getBySelectText,
    getByPlaceholderText,
    getByText,
    getByTestId,
    getByAltText,
    getByTitle,
    getByValue,
  } = render('<div />')
  expect(() => getByLabelText('LucyRicardo')).toThrowErrorMatchingSnapshot()
  expect(() => getBySelectText('LucyRicardo')).toThrowErrorMatchingSnapshot()
  expect(() =>
    getByPlaceholderText('LucyRicardo'),
  ).toThrowErrorMatchingSnapshot()
  expect(() => getByText('LucyRicardo')).toThrowErrorMatchingSnapshot()
  expect(() => getByTestId('LucyRicardo')).toThrowErrorMatchingSnapshot()
  expect(() => getByAltText('LucyRicardo')).toThrowErrorMatchingSnapshot()
  expect(() => getByTitle('LucyRicardo')).toThrowErrorMatchingSnapshot()
  expect(() => getByValue('LucyRicardo')).toThrowErrorMatchingSnapshot()
})

/* eslint jsx-a11y/label-has-for:0 */

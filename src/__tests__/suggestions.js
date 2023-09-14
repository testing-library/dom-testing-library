import {configure} from '../config'
import {screen, getSuggestedQuery} from '..'
import {renderIntoDocument, render} from './helpers/test-utils'

beforeAll(() => {
  configure({throwSuggestions: true})
})

beforeEach(() => {
  // We're testing suggestions of find* queries but we're not interested in their time-related behavior.
  // Real timers would make the test suite slower for no reason.
  jest.useFakeTimers()
})

afterEach(() => {
  jest.useRealTimers()
  configure({testIdAttribute: 'data-testid', throwSuggestions: true})
  console.warn.mockClear()
})

afterAll(() => {
  configure({throwSuggestions: false})
})

test('does not suggest for nested inline style', () => {
  renderIntoDocument(
    `<div data-testid="style"><style>.hsuHs{margin:auto}.wFncld{margin-top:3px;color:#9AA0A6;height:20px;width:20px}</style></div>`,
  )

  expect(() => screen.getByTestId('style')).not.toThrow()
})

test('does not suggest for inline script, style', () => {
  renderIntoDocument(
    `<script data-testid="script">alert('hello')</script><style data-testid="style">.hsuHs{margin:auto}.wFncld{margin-top:3px;color:#9AA0A6;height:20px;width:20px}</style>`,
  )

  expect(() => screen.getByTestId('script')).not.toThrow()
  expect(() => screen.getByTestId('style')).not.toThrow()
})

test('respects ignores', () => {
  renderIntoDocument(`<my-thing>foo</my-thing>`)

  expect(() =>
    screen.queryByText('foo', {ignore: 'my-thing'}),
  ).not.toThrowError()
})

test('does not suggest query that would give a different element', () => {
  renderIntoDocument(`
  <div data-testid="foo"><img src="foo" /></div>
  <div data-testid="bar"><a href="/foo"><div role="figure"><img src="foo" /></div></a></div>
  <a data-testid="baz"><h1>link text</h1></a>
  `)

  expect(() => screen.getByTestId('foo')).not.toThrowError()
  expect(() => screen.getByTestId('bar')).not.toThrowError()
  expect(() => screen.getByTestId('baz')).not.toThrowError()
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

test('should suggest by label over title', () => {
  renderIntoDocument(
    `<label><span>bar</span><input type="password" title="foo" /></label>`,
  )

  expect(() => screen.getByTitle('foo')).toThrowError(
    /getByLabelText\(\/bar\/i\)/,
  )
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

test('should suggest when suggest is turned on for a specific query but disabled in config', () => {
  configure({throwSuggestions: false})
  renderIntoDocument(`
  <button data-testid="foo">submit</button>
  <button data-testid="foot">another</button>`)

  expect(() => screen.getByTestId('foo', {suggest: true})).toThrowError(
    "try this:\ngetByRole('button', { name: /submit/i })",
  )
})

test('should suggest getByRole when used with getBy', () => {
  renderIntoDocument(`<button data-testid="foo">submit</button>`)

  expect(() => screen.getByTestId('foo')).toThrowErrorMatchingInlineSnapshot(`
    A better query is available, try this:
    getByRole('button', { name: /submit/i })


    Ignored nodes: comments, script, style
    <body>
      <button
        data-testid="foo"
      >
        submit
      </button>
    </body>
  `)
})

test('should suggest getAllByRole when used with getAllByTestId', () => {
  renderIntoDocument(`
    <button data-testid="foo">submit</button>
    <button data-testid="foo">submit</button>`)

  expect(() => screen.getAllByTestId('foo'))
    .toThrowErrorMatchingInlineSnapshot(`
    A better query is available, try this:
    getAllByRole('button', { name: /submit/i })


    Ignored nodes: comments, script, style
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
    </body>
  `)
})
test('should suggest findByRole when used with findByTestId', async () => {
  renderIntoDocument(`
  <button data-testid="foo">submit</button>
  <button data-testid="foot">submit</button>
  `)

  await expect(screen.findByTestId('foo')).rejects.toThrowError(
    /findByRole\('button', \{ name: \/submit\/i \}\)/,
  )
  await expect(screen.findAllByTestId(/foo/)).rejects.toThrowError(
    /findAllByRole\('button', \{ name: \/submit\/i \}\)/,
  )
})

test('should suggest img role w/ alt text', () => {
  renderIntoDocument(`<img data-testid="img" alt="Incredibles 2 Poster"  />`)

  expect(() => screen.getByAltText('Incredibles 2 Poster')).toThrowError(
    /getByRole\('img', \{ name: \/incredibles 2 poster\/i \}\)/,
  )
})

test('escapes regular expressions in suggestion', () => {
  const {container} = renderIntoDocument(`
      <label for="superInput">inp-t lab^l w{th c+ars to esc\\pe</label>
      <input id="superInput" type="text" value="my super string +-('{}^$)" placeholder="should escape +-'(/" />
      <span>
        Loading ... (1)
      </span>
      <img src="foo.png" alt="The Problem (picture of a question mark)" data-testid="foo" />
    `)

  expect(() => screen.getByTestId('foo')).toThrowError(
    /getByRole\('img', \{ name: \/the problem \\\(picture of a question mark\\\)\/i \}\)/,
  )

  expect(
    getSuggestedQuery(
      container.querySelector('img'),
      'get',
      'altText',
    ).toString(),
  ).toEqual(`getByAltText(/the problem \\(picture of a question mark\\)/i)`)

  expect(getSuggestedQuery(container.querySelector('span')).toString()).toEqual(
    `getByText(/loading \\.\\.\\. \\(1\\)/i)`,
  )

  expect(
    getSuggestedQuery(
      container.querySelector('input'),
      'get',
      'placeholderText',
    ).toString(),
  ).toEqual(`getByPlaceholderText(/should escape \\+\\-'\\(\\//i)`)

  expect(
    getSuggestedQuery(
      container.querySelector('input'),
      'get',
      'displayValue',
    ).toString(),
  ).toEqual(`getByDisplayValue(/my super string \\+\\-\\('\\{\\}\\^\\$\\)/i)`)

  expect(
    getSuggestedQuery(
      container.querySelector('input'),
      'get',
      'labelText',
    ).toString(),
  ).toEqual(`getByLabelText(/inp\\-t lab\\^l w\\{th c\\+ars to esc\\\\pe/i)`)
})

test('should suggest getByLabelText when no role available', () => {
  renderIntoDocument(
    `<label for="foo">Username</label><input type="password" data-testid="foo" id="foo" />`,
  )
  expect(() => screen.getByTestId('foo')).toThrowError(
    /getByLabelText\(\/username\/i\)/,
  )
})

it('should not suggest by label when using by label', async () => {
  renderIntoDocument(
    `<label><span>bar</span><input type="password" title="foo" /></label>`,
  )

  // if a suggestion is made, this call will throw, thus failing the test.
  const password = await screen.findByLabelText(/bar/i)
  expect(password).toHaveAttribute('type', 'password')
})

test(`should suggest getByLabel on non form elements`, () => {
  renderIntoDocument(`
  <div data-testid="foo" aria-labelledby="section-one-header">
    <span id="section-one-header">Section One</span>
    <p>some content</p>
  </div>
  `)

  expect(() => screen.getByTestId('foo')).toThrowError(
    /getByLabelText\(\/section one\/i\)/,
  )
})

test.each([
  `<label id="username-label">Username</label><input aria-labelledby="username-label" type="text" />`,
  `<label><span>Username</span><input type="text" /></label>`,
  `<label for="foo">Username</label><input id="foo" type="text" />`,
])('%s\nshould suggest getByRole over', async html => {
  renderIntoDocument(html)

  expect(() => screen.getByLabelText('Username')).toThrowError(
    /getByRole\('textbox', \{ name: \/username\/i \}\)/,
  )
  expect(() => screen.getAllByLabelText('Username')).toThrowError(
    /getAllByRole\('textbox', \{ name: \/username\/i \}\)/,
  )

  expect(() => screen.queryByLabelText('Username')).toThrowError(
    /queryByRole\('textbox', \{ name: \/username\/i \}\)/,
  )
  expect(() => screen.queryAllByLabelText('Username')).toThrowError(
    /queryAllByRole\('textbox', \{ name: \/username\/i \}\)/,
  )

  await expect(screen.findByLabelText('Username')).rejects.toThrowError(
    /findByRole\('textbox', \{ name: \/username\/i \}\)/,
  )
  await expect(screen.findAllByLabelText(/Username/)).rejects.toThrowError(
    /findAllByRole\('textbox', \{ name: \/username\/i \}\)/,
  )
})

test(`should suggest label over placeholder text`, () => {
  renderIntoDocument(
    `<label for="foo">Password</label><input type="password" id="foo" data-testid="foo" placeholder="Password" />`,
  )

  expect(() => screen.getByPlaceholderText('Password')).toThrowError(
    /getByLabelText\(\/password\/i\)/,
  )
})

test(`should suggest getByPlaceholderText`, () => {
  renderIntoDocument(
    `<input type="password" data-testid="foo" placeholder="Password" />`,
  )

  expect(() => screen.getByTestId('foo')).toThrowError(
    /getByPlaceholderText\(\/password\/i\)/,
  )
})

test(`should suggest getByText for simple elements`, () => {
  renderIntoDocument(`<div data-testid="foo">hello there</div>`)

  expect(() => screen.getByTestId('foo')).toThrowError(
    /getByText\(\/hello there\/i\)/,
  )
})

test(`should suggest getByDisplayValue`, () => {
  renderIntoDocument(
    `<input type="password" id="password" data-testid="password" />`,
  )

  document.getElementById('password').value = 'Prine' // RIP John Prine

  expect(() => screen.getByTestId('password')).toThrowError(
    /getByDisplayValue\(\/prine\/i\)/,
  )
})

test(`should suggest getByAltText`, () => {
  renderIntoDocument(`
    <input type="password" data-testid="input" alt="password" />
    <map name="workmap">
      <area data-testid="area" shape="rect" coords="34,44,270,350" alt="Computer">
    </map>
    `)

  expect(() => screen.getByTestId('input')).toThrowError(
    /getByAltText\(\/password\/i\)/,
  )
  expect(() => screen.getByTestId('area')).toThrowError(
    /getByAltText\(\/computer\/i\)/,
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
    /getByTitle\(\/delete\/i\)/,
  )
  expect(() => screen.getAllByTestId('delete')).toThrowError(
    /getAllByTitle\(\/delete\/i\)/,
  )
  expect(() => screen.queryByTestId('delete')).toThrowError(
    /queryByTitle\(\/delete\/i\)/,
  )
  expect(() => screen.queryAllByTestId('delete')).toThrowError(
    /queryAllByTitle\(\/delete\/i\)/,
  )
  expect(() => screen.queryAllByTestId('delete')).toThrowError(
    /queryAllByTitle\(\/delete\/i\)/,
  )
  expect(() => screen.queryAllByTestId('delete')).toThrowError(
    /queryAllByTitle\(\/delete\/i\)/,
  )

  // Since `ByTitle` and `ByText` will both return the <title> element
  // `getByText` will always be the suggested query as it is higher up the list.
  expect(() => screen.getByTestId('svg')).toThrowError(
    /getByText\(\/close\/i\)/,
  )
})

test('getSuggestedQuery handles `variant` and defaults to `get`', () => {
  const button = render(`<button>submit</button>`).container.firstChild

  expect(getSuggestedQuery(button).toString()).toMatch(/getByRole/)
  expect(getSuggestedQuery(button, 'get').toString()).toMatch(/getByRole/)
  expect(getSuggestedQuery(button, 'getAll').toString()).toMatch(/getAllByRole/)
  expect(getSuggestedQuery(button, 'query').toString()).toMatch(/queryByRole/)
  expect(getSuggestedQuery(button, 'queryAll').toString()).toMatch(
    /queryAllByRole/,
  )
  expect(getSuggestedQuery(button, 'find').toString()).toMatch(/findByRole/)
  expect(getSuggestedQuery(button, 'findAll').toString()).toMatch(
    /findAllByRole/,
  )
})

test('getSuggestedQuery returns rich data for tooling', () => {
  const button = render(`<button>submit</button>`).container.firstChild

  expect(getSuggestedQuery(button)).toMatchObject({
    queryName: 'Role',
    queryMethod: 'getByRole',
    queryArgs: ['button', {name: /submit/i}],
    variant: 'get',
  })

  expect(getSuggestedQuery(button).toString()).toEqual(
    `getByRole('button', { name: /submit/i })`,
  )

  const div = render(`<a>cancel</a>`).container.firstChild

  expect(getSuggestedQuery(div)).toMatchObject({
    queryName: 'Text',
    queryMethod: 'getByText',
    queryArgs: [/cancel/i],
    variant: 'get',
  })

  expect(getSuggestedQuery(div).toString()).toEqual(`getByText(/cancel/i)`)
})

test('getSuggestedQuery can return specified methods in addition to the best', () => {
  const {container} = render(`
    <label for="username">label</label>
    <input
      id="username"
      name="name"
      placeholder="placeholder"
      data-testid="testid"
      title="title"
      alt="alt"
      value="value"
      type="text"
    />
    <button>button</button>
  `)

  const input = container.querySelector('input')
  const button = container.querySelector('button')

  // this function should be insensitive for the method param.
  // Role and role should work the same
  expect(getSuggestedQuery(input, 'get', 'role')).toMatchObject({
    queryName: 'Role',
    queryMethod: 'getByRole',
    queryArgs: ['textbox', {name: /label/i}],
    variant: 'get',
  })

  expect(getSuggestedQuery(input, 'get', 'LabelText')).toMatchObject({
    queryName: 'LabelText',
    queryMethod: 'getByLabelText',
    queryArgs: [/label/i],
    variant: 'get',
  })

  expect(getSuggestedQuery(input, 'get', 'PlaceholderText')).toMatchObject({
    queryName: 'PlaceholderText',
    queryMethod: 'getByPlaceholderText',
    queryArgs: [/placeholder/i],
    variant: 'get',
  })

  expect(getSuggestedQuery(button, 'get', 'Text')).toMatchObject({
    queryName: 'Text',
    queryMethod: 'getByText',
    queryArgs: [/button/],
    variant: 'get',
  })

  expect(getSuggestedQuery(input, 'get', 'DisplayValue')).toMatchObject({
    queryName: 'DisplayValue',
    queryMethod: 'getByDisplayValue',
    queryArgs: [/value/i],
    variant: 'get',
  })

  expect(getSuggestedQuery(input, 'get', 'AltText')).toMatchObject({
    queryName: 'AltText',
    queryMethod: 'getByAltText',
    queryArgs: [/alt/],
    variant: 'get',
  })

  expect(getSuggestedQuery(input, 'get', 'Title')).toMatchObject({
    queryName: 'Title',
    queryMethod: 'getByTitle',
    queryArgs: [/title/i],
    variant: 'get',
  })

  expect(getSuggestedQuery(input, 'get', 'TestId')).toMatchObject({
    queryName: 'TestId',
    queryMethod: 'getByTestId',
    queryArgs: ['testid'],
    variant: 'get',
  })

  // return undefined if requested query can't be made
  expect(getSuggestedQuery(button, 'get', 'TestId')).toBeUndefined()
})

test('getSuggestedQuery works with custom testIdAttribute', () => {
  configure({testIdAttribute: 'data-test'})

  const {container} = render(`
    <label for="username">label</label>
    <input
      id="username"
      name="name"
      placeholder="placeholder"
      data-test="testid"
      title="title"
      alt="alt"
      value="value"
      type="text"
    />
    <button>button</button>
  `)

  const input = container.querySelector('input')

  expect(getSuggestedQuery(input, 'get', 'TestId')).toMatchObject({
    queryName: 'TestId',
    queryMethod: 'getByTestId',
    queryArgs: ['testid'],
    variant: 'get',
  })
})

test('getSuggestedQuery does not create suggestions for script and style elements', () => {
  const {container} = render(`
    <script data-testid="script"></script>
    <style data-testid="style"></style>
  `)

  const script = container.querySelector('script')
  const style = container.querySelector('style')

  expect(getSuggestedQuery(script, 'get', 'TestId')).toBeUndefined()
  expect(getSuggestedQuery(style, 'get', 'TestId')).toBeUndefined()
})

// this is only a temporary fix. The problem is that at the moment @testing-library/dom
// not support label concatenation
// see https://github.com/testing-library/dom-testing-library/issues/545
test('should get the first label with aria-labelledby contains multiple ids', () => {
  const {container} = renderIntoDocument(`
    <div id="one">One</div>
    <div id="two">One</div>
    <input
      type="text"
      aria-labelledby="one two"
    />
  `)

  expect(
    getSuggestedQuery(container.querySelector('input'), 'get', 'labelText'),
  ).toMatchObject({
    queryName: 'LabelText',
    queryMethod: 'getByLabelText',
    queryArgs: [/one/i],
    variant: 'get',
  })
})

test('should not suggest or warn about hidden element when suggested query is already used.', () => {
  console.warn.mockImplementation(() => {})

  renderIntoDocument(`
    <input type="text" aria-hidden=true />
  `)

  expect(() => screen.getByRole('textbox', {hidden: true})).not.toThrowError()
  expect(console.warn).not.toHaveBeenCalled()
})
test('should suggest and warn about if element is not in the accessibility tree', () => {
  console.warn.mockImplementation(() => {})

  renderIntoDocument(`
    <input type="text" data-testid="foo" aria-hidden=true />
  `)

  expect(() => screen.getByTestId('foo', {hidden: true})).toThrowError(
    /getByRole\('textbox', \{ hidden: true \}\)/,
  )
  expect(console.warn).toHaveBeenCalledWith(
    expect.stringContaining(`Element is inaccessible.`),
  )
})

test('should suggest hidden option if element is not in the accessibility tree', () => {
  console.warn.mockImplementation(() => {})

  const {container} = renderIntoDocument(`
    <input type="text" data-testid="foo" aria-hidden=true />
  `)

  const suggestion = getSuggestedQuery(
    container.querySelector('input'),
    'get',
    'role',
  )
  expect(suggestion).toMatchObject({
    queryName: 'Role',
    queryMethod: 'getByRole',
    queryArgs: ['textbox', {hidden: true}],
    variant: 'get',
    warning: `Element is inaccessible. This means that the element and all its children are invisible to screen readers.
    If you are using the aria-hidden prop, make sure this is the right choice for your case.
    `,
  })
  suggestion.toString()

  expect(console.warn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        Element is inaccessible. This means that the element and all its children are invisible to screen readers.
        If you are using the aria-hidden prop, make sure this is the right choice for your case.
        ,
      ],
    ]
  `)
})

test('should find label text using the aria-labelledby', () => {
  const {container} = renderIntoDocument(`
  <div>
      <div>
        <input id="sixth-label-one" value="6th one"/>
        <input id="sixth-label-two" value="6th two"/>
        <label id="sixth-label-three">6th three</label>
        <input aria-labelledby="sixth-label-one sixth-label-two sixth-label-three" id="sixth-id" />
      </div>
    </div>
  `)

  expect(
    getSuggestedQuery(
      container.querySelector('[id="sixth-id"]'),
      'get',
      'labelText',
    ),
  ).toMatchInlineSnapshot(
    {
      queryArgs: [/6th one 6th two 6th three/i],
      queryMethod: 'getByLabelText',
      queryName: 'LabelText',
      variant: 'get',
      warning: '',
    },
    `
    {
      queryArgs: [
        {},
      ],
      queryMethod: getByLabelText,
      queryName: LabelText,
      toString: [Function],
      variant: get,
      warning: ,
    }
  `,
  )
})

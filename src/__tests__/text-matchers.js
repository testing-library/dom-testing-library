import cases from 'jest-in-case'

import {getDefaultNormalizer} from '../'
import {render} from './helpers/test-utils'

cases(
  'matches find case-sensitive full strings by default',
  ({dom, query, queryFn}) => {
    const queries = render(dom)

    const queryString = query
    const queryRegex = new RegExp(query)
    const queryFunc = text => text === query

    expect(queries[queryFn](queryString)).toHaveLength(1)
    expect(queries[queryFn](queryRegex)).toHaveLength(1)
    expect(queries[queryFn](queryFunc)).toHaveLength(1)

    expect(queries[queryFn](query.toUpperCase())).toHaveLength(0) // case
    expect(queries[queryFn](query.slice(0, 1))).toHaveLength(0) // substring
  },
  {
    queryAllByTestId: {
      dom: `<a data-testid="link" href="#">Link</a>`,
      query: `link`,
      queryFn: `queryAllByTestId`,
    },
    queryAllByAltText: {
      dom: `
        <img
          alt="Finding Nemo poster" 
          src="/finding-nemo.png"
        />`,
      query: `Finding Nemo poster`,
      queryFn: `queryAllByAltText`,
    },
    'queryAllByAltText (for amp-img)': {
      dom: `
        <amp-img
          alt="Finding Nemo poster" 
          src="/finding-nemo.png"
        />`,
      query: `Finding Nemo poster`,
      queryFn: `queryAllByAltText`,
    },
    queryAllByPlaceholderText: {
      dom: `<input placeholder="Dwayne 'The Rock' Johnson" />`,
      query: `Dwayne 'The Rock' Johnson`,
      queryFn: `queryAllByPlaceholderText`,
    },
    'queryAllByDisplayValue (for select)': {
      dom: `
      <select>
        <option>Option 1</option>
        <option>Option 2</option>
      </select>`,
      query: `Option 1`,
      queryFn: `queryAllByDisplayValue`,
    },
    queryAllByText: {
      dom: `<p>Some content</p>`,
      query: `Some content`,
      queryFn: `queryAllByText`,
    },
    queryAllByLabelText: {
      dom: `
        <label for="username">User Name</label>
        <input id="username" />`,
      query: `User Name`,
      queryFn: `queryAllByLabelText`,
    },
  },
)

cases(
  'queries trim leading, trailing & inner whitespace by default',
  ({dom, query, queryFn}) => {
    const queries = render(dom)
    expect(queries[queryFn](query)).toHaveLength(1)
    expect(
      queries[queryFn](query, {
        normalizer: getDefaultNormalizer({
          collapseWhitespace: false,
          trim: false,
        }),
      }),
    ).toHaveLength(0)
  },
  {
    queryAllByTestId: {
      dom: `<a data-testid=" link " href="#">Link</a>`,
      query: /^link$/,
      queryFn: `queryAllByTestId`,
    },
    queryAllByAltText: {
      dom: `
        <img
          alt="
            Finding Nemo poster " 
          src="/finding-nemo.png"
        />`,
      query: /^Finding Nemo poster$/,
      queryFn: `queryAllByAltText`,
    },
    'queryAllByAltText (for amp-img)': {
      dom: `
        <amp-img
          alt="
            Finding Nemo poster " 
          src="/finding-nemo.png"
        />`,
      query: /^Finding Nemo poster$/,
      queryFn: `queryAllByAltText`,
    },
    queryAllByPlaceholderText: {
      dom: `
        <input placeholder="  Dwayne 'The Rock' Johnson  " />`,
      query: /^Dwayne/,
      queryFn: `queryAllByPlaceholderText`,
    },
    'queryAllByDisplayValue (for select)': {
      dom: `
      <select>
        <option>  Option 1  </option>
        <option>Option 2</option>
      </select>`,
      query: `Option 1`,
      queryFn: `queryAllByDisplayValue`,
    },
    queryAllByText: {
      dom: `
        <p>
          Content
          with
          linebreaks
          is
          ok
        </p>`,
      query: `Content with linebreaks is ok`,
      queryFn: `queryAllByText`,
    },
    queryAllByLabelText: {
      dom: `
        <label for="username">
          User
          Name
        </label>
        <input id="username" />`,
      query: `User Name`,
      queryFn: `queryAllByLabelText`,
    },
  },
)

cases(
  '{ exact } option toggles case-insensitive partial matches',
  ({dom, query, queryFn}) => {
    const queries = render(dom)

    const queryString = query
    const queryRegex = new RegExp(query)
    const queryFunc = text => text === query

    expect(queries[queryFn](query)).toHaveLength(1)

    expect(queries[queryFn](queryString, {exact: false})).toHaveLength(1)
    expect(queries[queryFn](queryRegex, {exact: false})).toHaveLength(1)
    expect(queries[queryFn](queryFunc, {exact: false})).toHaveLength(1)

    expect(queries[queryFn](query.split(' ')[0], {exact: false})).toHaveLength(
      1,
    )
    expect(queries[queryFn](query.toLowerCase(), {exact: false})).toHaveLength(
      1,
    )
  },
  {
    queryAllByPlaceholderText: {
      dom: `<input placeholder="Dwayne 'The Rock' Johnson" />`,
      query: `Dwayne 'The Rock' Johnson`,
      queryFn: `queryAllByPlaceholderText`,
    },
    'queryAllByDisplayValue (for select)': {
      dom: `
      <select>
        <option>Option 1</option>
        <option>Option 2</option>
      </select>`,
      query: `Option 1`,
      queryFn: `queryAllByDisplayValue`,
    },
    queryAllByLabelText: {
      dom: `
        <label for="username">User Name</label>
        <input id="username" />`,
      query: `User Name`,
      queryFn: `queryAllByLabelText`,
    },
    queryAllByText: {
      dom: `
        <p>
          Content
          with
          linebreaks
          is
          ok
        </p>`,
      query: `Content with linebreaks is ok`,
      queryFn: `queryAllByText`,
    },
    queryAllByAltText: {
      dom: `
        <img
          alt="Finding Nemo poster" 
          src="/finding-nemo.png"
        />`,
      query: `Finding Nemo poster`,
      queryFn: `queryAllByAltText`,
    },
    'queryAllByAltText (for amp-img)': {
      dom: `
        <amp-img
          alt="Finding Nemo poster" 
          src="/finding-nemo.png"
        />`,
      query: `Finding Nemo poster`,
      queryFn: `queryAllByAltText`,
    },
  },
)

// A good use case for a custom normalizer is stripping
// out Unicode control characters such as LRM (left-right-mark)
// before matching
const LRM = '\u200e'
function removeUCC(str) {
  return str.replace(/[\u200e]/g, '')
}

cases(
  '{ normalizer } option allows custom pre-match normalization',
  ({dom, queryFn}) => {
    const queries = render(dom)

    const query = queries[queryFn]

    // With the correct normalizer, we should match
    expect(query(/user n.me/i, {normalizer: removeUCC})).toHaveLength(1)
    expect(query('User name', {normalizer: removeUCC})).toHaveLength(1)

    // Without the normalizer, we shouldn't
    expect(query(/user n.me/i)).toHaveLength(0)
    expect(query('User name')).toHaveLength(0)
  },
  {
    queryAllByLabelText: {
      dom: `
        <label for="username">User ${LRM}name</label>
        <input id="username" />`,
      queryFn: 'queryAllByLabelText',
    },
    queryAllByAriaLabelText: {
      dom: `<div aria-label="User ${LRM}name"/>`,
      queryFn: 'queryAllByLabelText',
    },
    queryAllByPlaceholderText: {
      dom: `<input placeholder="User ${LRM}name" />`,
      queryFn: 'queryAllByPlaceholderText',
    },
    'queryAllByDisplayValue (for select)': {
      dom: `<select><option>User ${LRM}name</option></select>`,
      queryFn: 'queryAllByDisplayValue',
    },
    queryAllByText: {
      dom: `<div>User ${LRM}name</div>`,
      queryFn: 'queryAllByText',
    },
    queryAllByAltText: {
      dom: `<img alt="User ${LRM}name" src="username.jpg" />`,
      queryFn: 'queryAllByAltText',
    },
    'queryAllByAltText (for amp-img)': {
      dom: `<amp-img alt="User ${LRM}name" src="username.jpg" />`,
      queryFn: 'queryAllByAltText',
    },
    queryAllByTitle: {
      dom: `<div title="User ${LRM}name" />`,
      queryFn: 'queryAllByTitle',
    },
    queryAllByDisplayValue: {
      dom: `<input value="User ${LRM}name" />`,
      queryFn: 'queryAllByDisplayValue',
    },
  },
)

test('normalizer works with both exact and non-exact matching', () => {
  const {queryAllByText} = render(`<div>MiXeD ${LRM}CaSe</div>`)

  expect(
    queryAllByText('mixed case', {exact: false, normalizer: removeUCC}),
  ).toHaveLength(1)
  expect(
    queryAllByText('mixed case', {exact: true, normalizer: removeUCC}),
  ).toHaveLength(0)
  expect(
    queryAllByText('MiXeD CaSe', {exact: true, normalizer: removeUCC}),
  ).toHaveLength(1)
  expect(queryAllByText('MiXeD CaSe', {exact: true})).toHaveLength(0)
})

test('top-level trim and collapseWhitespace options are not supported if normalizer is specified', () => {
  const {queryAllByText} = render('<div>  abc  def  </div>')
  const normalizer = str => str

  expect(() => queryAllByText('abc', {trim: false, normalizer})).toThrow()
  expect(() => queryAllByText('abc', {trim: true, normalizer})).toThrow()
  expect(() =>
    queryAllByText('abc', {collapseWhitespace: false, normalizer}),
  ).toThrow()
  expect(() =>
    queryAllByText('abc', {collapseWhitespace: true, normalizer}),
  ).toThrow()
})

test('getDefaultNormalizer returns a normalizer that supports trim and collapseWhitespace', () => {
  // Default is trim: true and collapseWhitespace: true
  expect(getDefaultNormalizer()('  abc  def  ')).toEqual('abc def')

  // Turning off trimming should not turn off whitespace collapsing
  expect(getDefaultNormalizer({trim: false})('  abc  def  ')).toEqual(
    ' abc def ',
  )

  // Turning off whitespace collapsing should not turn off trimming
  expect(
    getDefaultNormalizer({collapseWhitespace: false})('  abc  def  '),
  ).toEqual('abc  def')

  // Whilst it's rather pointless, we should be able to turn both off
  expect(
    getDefaultNormalizer({trim: false, collapseWhitespace: false})(
      '  abc  def  ',
    ),
  ).toEqual('  abc  def  ')
})

test('we support an older API with trim and collapseWhitespace instead of a normalizer', () => {
  const {queryAllByText} = render('<div>  x  y  </div>')
  expect(queryAllByText('x y')).toHaveLength(1)
  expect(queryAllByText('x y', {trim: false})).toHaveLength(0)
  expect(queryAllByText(' x y ', {trim: false})).toHaveLength(1)
  expect(queryAllByText('x y', {collapseWhitespace: false})).toHaveLength(0)
  expect(queryAllByText('x  y', {collapseWhitespace: false})).toHaveLength(1)
})

import 'jest-dom/extend-expect'
import cases from 'jest-in-case'
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
    queryAllByPlaceholderText: {
      dom: `<input placeholder="Dwayne 'The Rock' Johnson" />`,
      query: `Dwayne 'The Rock' Johnson`,
      queryFn: `queryAllByPlaceholderText`,
    },
    queryAllBySelectText: {
      dom: `
      <select>
        <option>Option 1</option>
        <option>Option 2</option>
      </select>`,
      query: `Option 1`,
      queryFn: `queryAllBySelectText`,
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
      queries[queryFn](query, {collapseWhitespace: false, trim: false}),
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
    queryAllByPlaceholderText: {
      dom: `
        <input placeholder="  Dwayne 'The Rock' Johnson  " />`,
      query: /^Dwayne/,
      queryFn: `queryAllByPlaceholderText`,
    },
    queryAllBySelectText: {
      dom: `
      <select>
        <option>  Option 1  </option>
        <option>Option 2</option>
      </select>`,
      query: `Option 1`,
      queryFn: `queryAllBySelectText`,
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
    queryAllBySelectText: {
      dom: `
      <select>
        <option>Option 1</option>
        <option>Option 2</option>
      </select>`,
      query: `Option 1`,
      queryFn: `queryAllBySelectText`,
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
  },
)

// A good use case for a custom normalizer is stripping
// out UCC codes such as LRM before matching
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
    queryAllByPlaceholderText: {
      dom: `<input placeholder="User ${LRM}name" />`,
      queryFn: 'queryAllByPlaceholderText',
    },
    queryAllBySelectText: {
      dom: `<select><option>User ${LRM}name</option></select>`,
      queryFn: 'queryAllBySelectText',
    },
    queryAllByText: {
      dom: `<div>User ${LRM}name</div>`,
      queryFn: 'queryAllByText',
    },
    queryAllByAltText: {
      dom: `<img alt="User ${LRM}name" src="username.jpg" />`,
      queryFn: 'queryAllByAltText',
    },
    queryAllByTitle: {
      dom: `<div title="User ${LRM}name" />`,
      queryFn: 'queryAllByTitle',
    },
    queryAllByValue: {
      dom: `<input value="User ${LRM}name" />`,
      queryFn: 'queryAllByValue',
    },
    queryAllByRole: {
      dom: `<input role="User ${LRM}name" />`,
      queryFn: 'queryAllByRole',
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

test('normalizer runs after trim and collapseWhitespace options', () => {
  // Our test text has leading and trailing spaces, and multiple
  // spaces in the middle; we'll make use of that fact to test
  // the execution order of trim/collapseWhitespace and the custom
  // normalizer
  const {queryAllByText} = render('<div>  abc  def  </div>')

  // Double-check the normal trim + collapseWhitespace behavior
  expect(
    queryAllByText('abc def', {trim: true, collapseWhitespace: true}),
  ).toHaveLength(1)

  // Test that again, but with a normalizer that replaces double
  // spaces with 'X' characters.  If that runs before trim/collapseWhitespace,
  // it'll prevent successful matching
  expect(
    queryAllByText('abc def', {
      trim: true,
      collapseWhitespace: true,
      normalizer: str => str.replace(/ {2}/g, 'X'),
    }),
  ).toHaveLength(1)

  // Test that, if we turn off trim + collapse, that the normalizer does
  // then get to see the double whitespace, and we should now be able
  // to match the Xs
  expect(
    queryAllByText('XabcXdefX', {
      trim: false,
      collapseWhitespace: false,
      // With the whitespace left in, this will add Xs which will
      // prevent matching
      normalizer: str => str.replace(/ {2}/g, 'X'),
    }),
  ).toHaveLength(1)
})

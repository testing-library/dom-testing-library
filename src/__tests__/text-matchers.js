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

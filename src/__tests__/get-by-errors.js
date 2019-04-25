import cases from 'jest-in-case'
import {render} from './helpers/test-utils'

cases(
  'getBy* queries throw an error when there are multiple elements returned',
  ({name, query, html}) => {
    const utils = render(html)
    expect(() => utils[name](query)).toThrow(/multiple elements/i)
  },
  {
    getByLabelText: {
      query: /his/,
      html: `<div aria-label="his"></div><div aria-label="history"></div>`,
    },
    getByPlaceholderText: {
      query: /his/,
      html: `<input placeholder="his" /><input placeholder="history" />`,
    },
    getByText: {
      query: /his/,
      html: `<div>his</div><div>history</div>`,
    },
    getByAltText: {
      query: /his/,
      html: `<img alt="his" src="his.png" /><img alt="history" src="history.png" />`,
    },
    getByTitle: {
      query: /his/,
      html: `<div title="his"></div><div title="history"></div>`,
    },
    getByDisplayValue: {
      query: /his/,
      html: `<input value="his" /><select><option value="history">history</option></select>`,
    },
    getByRole: {
      query: /his/,
      html: `<div role="his"></div><div role="history"></div>`,
    },
    getByTestId: {
      query: /his/,
      html: `<div data-testid="his"></div><div data-testid="history"></div>`,
    },
  },
)

cases(
  'queryBy* queries throw an error when there are multiple elements returned',
  ({name, query, html}) => {
    const utils = render(html)
    expect(() => utils[name](query)).toThrow(/multiple elements/i)
  },
  {
    queryByLabelText: {
      query: /his/,
      html: `<div aria-label="his"></div><div aria-label="history"></div>`,
    },
    queryByPlaceholderText: {
      query: /his/,
      html: `<input placeholder="his" /><input placeholder="history" />`,
    },
    queryByText: {
      query: /his/,
      html: `<div>his</div><div>history</div>`,
    },
    queryByAltText: {
      query: /his/,
      html: `<img alt="his" src="his.png" /><img alt="history" src="history.png" />`,
    },
    queryByTitle: {
      query: /his/,
      html: `<div title="his"></div><div title="history"></div>`,
    },
    queryByDisplayValue: {
      query: /his/,
      html: `<input value="his" /><select><option value="history">history</option></select>`,
    },
    queryByRole: {
      query: /his/,
      html: `<div role="his"></div><div role="history"></div>`,
    },
    queryByTestId: {
      query: /his/,
      html: `<div data-testid="his"></div><div data-testid="history"></div>`,
    },
  },
)

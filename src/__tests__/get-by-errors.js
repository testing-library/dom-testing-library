import cases from 'jest-in-case'
import {screen} from '../'
import {configure, getConfig} from '../config'
import {render} from './helpers/test-utils'

const originalConfig = getConfig()
beforeEach(() => {
  configure(originalConfig)
})

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
    getByRole: {
      query: 'button',
      html: `<button>one</button><div role="button">two</button>`,
    },
    getByTestId: {
      query: /his/,
      html: `<div data-testid="his"></div><div data-testid="history"></div>`,
    },
  },
)

test.each([['getByText'], ['getByLabelText']])(
  '%s query will throw the custom error returned by config.getElementError',
  query => {
    const getElementError = jest.fn(
      (message, _container) => new Error(`My custom error: ${message}`),
    )
    configure({getElementError})
    document.body.innerHTML = '<div>Hello</div>'
    expect(() => screen[query]('TEST QUERY')).toThrowErrorMatchingSnapshot()
    expect(getElementError).toBeCalledTimes(1)
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
    queryByRole: {
      query: 'button',
      html: `<button>one</button><div role="button">two</button>`,
    },
    queryByTestId: {
      query: /his/,
      html: `<div data-testid="his"></div><div data-testid="history"></div>`,
    },
  },
)

describe('*ByDisplayValue queries throw an error when there are multiple elements returned', () => {
  test('getByDisplayValue', () => {
    const {getByDisplayValue} = render(
      `<input value="his" /><select><option value="history">history</option></select>`,
    )
    expect(() => getByDisplayValue(/his/)).toThrow(
      /multiple elements with the display value:/i,
    )
  })
  test('queryByDisplayValue', () => {
    const {queryByDisplayValue} = render(
      `<input value="his" /><select><option value="history">history</option></select>`,
    )
    expect(() => queryByDisplayValue(/his/)).toThrow(
      /multiple elements with the display value:/i,
    )
  })
})

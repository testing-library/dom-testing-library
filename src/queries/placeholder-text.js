import {
  queryAllByAttribute,
  makeFindQuery,
  makeSingleQuery,
  makeGetAllQuery,
} from './all-utils'

const queryAllByPlaceholderText = queryAllByAttribute.bind(null, 'placeholder')

const getMultipleError = (c, text) =>
  `Found multiple elements with the placeholder text of: ${text}`
const queryByPlaceholderText = makeSingleQuery(
  queryAllByPlaceholderText,
  getMultipleError,
)
const getAllByPlaceholderText = makeGetAllQuery(
  queryAllByPlaceholderText,
  (c, text) =>
    `Unable to find an element with the placeholder text of: ${text}`,
)
const getByPlaceholderText = makeSingleQuery(
  getAllByPlaceholderText,
  getMultipleError,
)

const findByPlaceholderText = makeFindQuery(getByPlaceholderText)
const findAllByPlaceholderText = makeFindQuery(getAllByPlaceholderText)

export {
  queryByPlaceholderText,
  queryAllByPlaceholderText,
  getByPlaceholderText,
  getAllByPlaceholderText,
  findAllByPlaceholderText,
  findByPlaceholderText,
}

import {getQueriesForElement} from '../get-queries-for-element'
import {queries} from '..'

test('uses default queries + debug method that prints out the given DOM element', () => {
  const container = document.createElement('div')
  const {debug, ...defaultBoundQueries} = getQueriesForElement(container)
  expect(Object.keys(defaultBoundQueries)).toEqual(Object.keys(queries))
  expect(debug).toBeDefined()
})

test('accepts custom queries', () => {
  const container = document.createElement('div')
  const customQuery = jest.fn()
  const boundQueries = getQueriesForElement(container, {
    ...queries,
    customQuery,
  })
  expect(boundQueries.customQuery).toBeDefined()
})

test('binds functions to container', () => {
  const container = document.createElement('div')
  const mock = jest.fn()
  function customQuery(element) {
    return mock(element)
  }
  const boundQueries = getQueriesForElement(container, {
    customQuery,
  })
  boundQueries.customQuery()
  expect(mock).toHaveBeenCalledWith(container)
})

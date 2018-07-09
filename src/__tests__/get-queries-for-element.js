import {getQueriesForElement} from '../get-queries-for-element'
import {queries} from '..'

test('uses default queries', () => {
  const container = document.createElement('div')
  const boundQueries = getQueriesForElement(container)
  expect(Object.keys(boundQueries)).toEqual(Object.keys(queries))
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

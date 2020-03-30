import * as queryHelpers from '../query-helpers'
import {configure, getConfig} from '../config'

const originalConfig = getConfig()
beforeEach(() => {
  configure(originalConfig)
})

test('should delegate to config.getElementError', () => {
  const getElementError = jest.fn()
  configure({getElementError})

  const message = 'test Message'
  const container = {} // dummy

  queryHelpers.getElementError(message, container)
  expect(getElementError.mock.calls[0]).toEqual([message, container])
})

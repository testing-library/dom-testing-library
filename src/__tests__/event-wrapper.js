import {configure, fireEvent} from '..'

let originalConfig

beforeEach(() => {
  configure(oldConfig => {
    originalConfig = oldConfig
    return null
  })
})

afterEach(() => {
  jest.clearAllMocks()
  configure(originalConfig)
})

test('fireEvent calls the eventWrapper', () => {
  const mockEventWrapper = jest.fn()
  configure(() => {
    return {eventWrapper: mockEventWrapper}
  })
  const el = document.createElement('div')
  fireEvent.click(el)
  expect(mockEventWrapper).toHaveBeenCalledWith(expect.any(Function))
  expect(mockEventWrapper).toHaveBeenCalledTimes(1)
})

test('fireEvent has a default eventWrapper', () => {
  const el = document.createElement('div')
  expect(() => fireEvent.click(el)).not.toThrow()
})

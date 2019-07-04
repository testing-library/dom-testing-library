import {
  getDocument,
  newMutationObserver,
  getSetTimeout,
  getClearTimeout,
} from '../helpers'

test('returns global document if exists', () => {
  expect(getDocument()).toBe(document)
})

describe('getSetTimeout', () => {
  it('returns mocked setTimeout if global.useFakeTimers is set and jest.useFakeTimers is used', () => {
    // global.useFakeTimers is set to true for all tests in tests/setup-env.js
    jest.useFakeTimers()

    const setTimeout = getSetTimeout(window)

    expect(setTimeout._isMockFunction).toBe(true)

    jest.useRealTimers()
  })
  it('returns original getSetTimeout from window', () => {
    const setTimeout = getSetTimeout(window)

    expect(setTimeout).toBe(window.setTimeout)
    expect(setTimeout._isMockFunction).toBe(undefined)
  })
  it('returns original getSetTimeout from global if window is undefined', () => {
    const setTimeout = getSetTimeout(undefined)

    expect(setTimeout).toBe(global.setTimeout)
    expect(setTimeout._isMockFunction).toBe(undefined)
  })
})

describe('getClearTimeout', () => {
  it('returns mocked clearTimeout if global.useFakeTimers is set and jest.useFakeTimers is used', () => {
    // global.useFakeTimers is set to true for all tests in tests/setup-env.js
    jest.useFakeTimers()

    const clearTimeout = getClearTimeout(window)

    expect(clearTimeout._isMockFunction).toBe(true)

    jest.useRealTimers()
  })
  it('returns original clearTimeout from window', () => {
    const clearTimeout = getClearTimeout(window)

    expect(clearTimeout).toBe(window.clearTimeout)
    expect(clearTimeout._isMockFunction).toBe(undefined)
  })
  it('returns original clearTimeout from global if window is undefined', () => {
    const clearTimeout = getClearTimeout(undefined)

    expect(clearTimeout).toBe(global.clearTimeout)
    expect(clearTimeout._isMockFunction).toBe(undefined)
  })
})

class DummyClass {
  constructor(args) {
    this.args = args
  }
}

describe('newMutationObserver', () => {
  if (typeof window === 'undefined') {
    it('instantiates mock MutationObserver if not availble on window', () => {
      expect(newMutationObserver(() => {}).observe).toBeDefined()
    })
  } else {
    it('instantiates from global MutationObserver if available', () => {
      const oldMutationObserver = window.MutationObserver
      window.MutationObserver = DummyClass

      try {
        expect(newMutationObserver('foobar').args).toEqual('foobar')
      } finally {
        window.MutationObserver = oldMutationObserver
      }
    })
  }
})

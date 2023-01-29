import {configure, getConfig} from '../config'

describe('configuration API', () => {
  let originalConfig
  beforeEach(() => {
    // Grab the existing configuration so we can restore
    // it at the end of the test
    configure(existingConfig => {
      originalConfig = existingConfig
      // Don't change the existing config
      return {}
    })
  })

  beforeEach(() => {
    configure({other: 123})
  })

  afterEach(() => {
    configure(originalConfig)
  })

  describe('getConfig', () => {
    test('returns existing configuration', () => {
      const conf = getConfig()
      expect(conf.testIdAttribute).toEqual('data-testid')
    })
  })

  describe('configure', () => {
    test('merges a delta rather than replacing the whole config', () => {
      const conf = getConfig()
      expect(conf).toMatchObject({testIdAttribute: 'data-testid'})
    })

    test('overrides existing values', () => {
      configure({testIdAttribute: 'new-id'})
      const conf = getConfig()
      expect(conf.testIdAttribute).toEqual('new-id')
    })

    test('passes existing config out to config function', () => {
      // Create a new config key based on the value of an existing one
      configure(existingConfig => ({
        testIdAttribute: `${existingConfig.testIdAttribute}-derived`,
      }))
      const conf = getConfig()

      // The new value should be there, and existing values should be
      // untouched
      expect(conf).toMatchObject({
        testIdAttribute: 'data-testid-derived',
      })
    })
  })
})

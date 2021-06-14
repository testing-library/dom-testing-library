import '@testing-library/jest-dom/extend-expect'
import jestSerializerAnsi from 'jest-serializer-ansi'

expect.addSnapshotSerializer(jestSerializerAnsi)
// add serializer for MutationRecord
expect.addSnapshotSerializer({
  print: (record, serialize) => {
    return serialize({
      addedNodes: record.addedNodes,
      attributeName: record.attributeName,
      attributeNamespace: record.attributeNamespace,
      nextSibling: record.nextSibling,
      oldValue: record.oldValue,
      previousSibling: record.previousSibling,
      removedNodes: record.removedNodes,
      target: record.target,
      type: record.type,
    })
  },
  test: value => {
    // list of records will stringify to the same value
    return (
      Array.isArray(value) === false &&
      String(value) === '[object MutationRecord]'
    )
  },
})

beforeAll(() => {
  const originalWarn = console.warn
  jest.spyOn(console, 'warn').mockImplementation((...args) => {
    if (args[0] && args[0].includes && args[0].includes('deprecated')) {
      return
    }
    originalWarn(...args)
  })
})

beforeEach(() => {
  // Using require here instead of importing it at the top, because the import resulted in
  // a function being used before a test had the chance to mock it.
  // https://github.com/testing-library/dom-testing-library/pull/852#discussion_r557077851
  require('../src/config').configure({printPlaygroundLink: false})
})

afterEach(() => {
  if (jest.isMockFunction(global.setTimeout)) {
    jest.useRealTimers()
  }
})

afterAll(() => {
  jest.restoreAllMocks()
})

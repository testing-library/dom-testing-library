import '@testing-library/jest-dom/extend-expect'

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

afterEach(() => {
  if (jest.isMockFunction(global.setTimeout)) {
    jest.useRealTimers()
  }
})

afterAll(() => {
  jest.restoreAllMocks()
})

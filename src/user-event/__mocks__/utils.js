// this helps us track what the state is before and after an event is fired
// this is needed for determining the snapshot values
const actual = jest.requireActual('../utils')

function getTrackedElementValues(element) {
  return {
    value: element.value,
    checked: element.checked,
    selectionStart: element.selectionStart,
    selectionEnd: element.selectionEnd,
    selectedOptions: element.selectedOptions
      ? Array.from(element.selectedOptions).map(o => o.value)
      : null,
  }
}

function wrapWithTestData(fn) {
  return async (element, init) => {
    const before = getTrackedElementValues(element)
    const testData = {before}

    // put it on the element so the event handler can grab it
    element.testData = testData
    const result = await fn(element, init)

    const after = getTrackedElementValues(element)
    Object.assign(testData, {after})

    // elete the testData for the next event
    delete element.testData
    return result
  }
}

const mockFireEvent = wrapWithTestData(actual.fireEvent)
for (const key of Object.keys(actual.fireEvent)) {
  if (typeof actual.fireEvent[key] === 'function') {
    mockFireEvent[key] = wrapWithTestData(actual.fireEvent[key], key)
  } else {
    mockFireEvent[key] = actual.fireEvent[key]
  }
}

module.exports = {
  ...actual,
  fireEvent: mockFireEvent,
}

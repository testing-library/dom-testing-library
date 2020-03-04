import {waitFor} from './wait-for'

const isRemoved = result => !result || (Array.isArray(result) && !result.length)

async function waitForElementToBeRemoved(callback, options) {
  if (!callback) {
    return Promise.reject(
      new Error(
        'waitForElementToBeRemoved requires a callback as the first parameter',
      ),
    )
  }

  // Check if the element is not present synchronously,
  // As the name implies, waitForElementToBeRemoved should check `present` --> `removed`
  if (isRemoved(callback())) {
    throw new Error(
      'The callback function which was passed did not return an element or non-empty array of elements. waitForElementToBeRemoved requires that the element(s) exist(s) before waiting for removal.',
    )
  }

  return waitFor(() => {
    let result
    try {
      result = callback()
    } catch (error) {
      if (error.name === 'TestingLibraryElementError') {
        return true
      }
      throw error
    }
    if (!isRemoved(result)) {
      throw new Error('Timed out in waitForElementToBeRemoved.')
    }
    return true
  }, options)
}

export {waitForElementToBeRemoved}

/*
eslint
  require-await: "off"
*/

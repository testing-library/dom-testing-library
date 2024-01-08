import {waitFor} from './wait-for'

const isRemoved = result => !result || (Array.isArray(result) && !result.length)

// Check if the element is not present.
// As the name implies, waitForElementToBeRemoved should check `present` --> `removed`
function initialCheck(elements) {
  if (isRemoved(elements)) {
    throw new Error(
      'The element(s) given to waitForElementToBeRemoved are already removed. waitForElementToBeRemoved requires that the element(s) exist(s) before waiting for removal.',
    )
  }
}

function wrapFunctionCallback(callback) {
  return () => {
    try {
      return callback()
    } catch (error) {
      if (error.name === 'TestingLibraryElementError') {
        return null
      }
      throw error
    }
  }
}

async function waitForElementToBeRemoved(callback, options) {
  // created here so we get a nice stacktrace
  const timeoutError = new Error('Timed out in waitForElementToBeRemoved.')
  if (typeof callback === 'function') {
    callback = wrapFunctionCallback(callback)
  } else {
    const elements = Array.isArray(callback) ? callback : [callback]
    const getRemainingElements = elements.map(element => {
      if (!element) return () => null
      let parent = element.parentElement
      if (parent === null) return () => null
      while (parent.parentElement) parent = parent.parentElement
      return () => (parent.contains(element) ? element : null)
    })
    callback = () => getRemainingElements.map(c => c()).filter(Boolean)
  }

  initialCheck(callback())

  return waitFor(() => {
    const result = callback()
    if (!isRemoved(result)) {
      throw timeoutError
    }
    return undefined
  }, options)
}

export {waitForElementToBeRemoved}

/*
eslint
  require-await: "off"
*/

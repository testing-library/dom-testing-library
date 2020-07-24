import {waitFor, WaitForOptions} from './wait-for'

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

async function waitForElementToBeRemoved<T extends Node>(
  callback: (() => T | T[]) | T | T[],
  options?: WaitForOptions,
) {
  // created here so we get a nice stacktrace
  const timeoutError = new Error('Timed out in waitForElementToBeRemoved.')
  let cb
  if (typeof callback !== 'function') {
    initialCheck(callback)
    const elements: Array<T> = Array.isArray(callback) ? callback : [callback]
    const getRemainingElements = elements.map(element => {
      let parent = element.parentElement
      while (parent.parentElement) parent = parent.parentElement
      return () => (parent.contains(element) ? element : null)
    })
    cb = () => getRemainingElements.map(c => c()).filter(Boolean)
  } else {
    cb = callback
  }

  initialCheck(cb())

  return waitFor(() => {
    let result
    try {
      result = cb()
    } catch (error) {
      if (error.name === 'TestingLibraryElementError') {
        return true
      }
      throw error
    }
    if (!isRemoved(result)) {
      throw timeoutError
    }
    return true
  }, options)
}

export {waitForElementToBeRemoved}

/*
eslint
  require-await: "off"
*/

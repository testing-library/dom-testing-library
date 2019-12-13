import {wait} from './wait'

async function waitForElement(callback, options) {
  if (!callback) {
    throw new Error('waitForElement requires a callback as the first parameter')
  }
  return wait(() => {
    const result = callback()
    if (!result) {
      throw new Error('Timed out in waitForElement.')
    }
    return result
  }, options)
}

export {waitForElement}

/*
eslint
  require-await: "off"
*/

import {wait} from './wait'

let hasWarned = false

// deprecated... TODO: remove this method. People should use a find* query or
// wait instead the reasoning is that this doesn't really do anything useful
// that you can't get from using find* or wait.
async function waitForElement(callback, options) {
  if (!hasWarned) {
    hasWarned = true
    console.warn(
      `\`waitForElement\` has been deprecated. Use \`wait\` instead (it's the same API, so you can find/replace): https://testing-library.com/docs/dom-testing-library/api-async#wait`,
    )
  }
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

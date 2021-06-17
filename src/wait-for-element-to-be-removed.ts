import {waitForOptions} from '../types'
import {waitFor} from './wait-for'

type Result = (Node | null)[] | Node | null

const isRemoved = (result: Result): boolean =>
  !result || (Array.isArray(result) && !result.length)

// Check if the element is not present.
// As the name implies, waitForElementToBeRemoved should check `present` --> `removed`
function initialCheck(elements: Result): void {
  if (isRemoved(elements)) {
    throw new Error(
      'The element(s) given to waitForElementToBeRemoved are already removed. waitForElementToBeRemoved requires that the element(s) exist(s) before waiting for removal.',
    )
  }
}

async function waitForElementToBeRemoved(
  arg: Result | (() => Result),
  options?: waitForOptions,
): Promise<void> {
  // created here so we get a nice stacktrace
  const timeoutError = new Error('Timed out in waitForElementToBeRemoved.')

  function handleArg(argument: Result): () => Result {
    initialCheck(argument)
    const elements = Array.isArray(argument) ? argument : [argument]
    const getRemainingElements = elements.map(element => {
      let parent = element?.parentElement
      if (!parent) return () => null
      while (parent.parentElement) parent = parent.parentElement
      return () => (parent?.contains(element) ? element : null)
    })
    return () => getRemainingElements.map(c => c()).filter(Boolean)
  }
  const callback = typeof arg === 'function' ? arg : handleArg(arg)

  initialCheck(callback())

  return waitFor(() => {
    let result
    try {
      result = callback()
    } catch (error: unknown) {
      if ((error as Error).name === 'TestingLibraryElementError') {
        return undefined
      }
      throw error
    }
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

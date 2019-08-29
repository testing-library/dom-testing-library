import {
  getDocument,
  newMutationObserver,
  setImmediate,
  setTimeout,
  clearTimeout,
} from './helpers'
import {getConfig} from './config'

function waitForElementToBeRemoved(
  callback,
  {
    container = getDocument(),
    timeout = getConfig().asyncUtilTimeout,
    mutationObserverOptions = {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true,
    },
  } = {},
) {
  return new Promise((resolve, reject) => {
    if (typeof callback !== 'function') {
      reject(
        new Error(
          'waitForElementToBeRemoved requires a function as the first parameter',
        ),
      )
    }
    const timer = setTimeout(onTimeout, timeout)
    const observer = newMutationObserver(onMutation)

    // Check if the element is not present synchronously,
    // As the name waitForElementToBeRemoved should check `present` --> `removed`
    try {
      const result = callback()
      if (!result || (Array.isArray(result) && !result.length)) {
        onDone(
          new Error(
            'The callback function which was passed did not return an element or non-empty array of elements. waitForElementToBeRemoved requires that the element(s) exist before waiting for removal.',
          ),
        )
      } else {
        // Only observe for mutations only if there is element while checking synchronously
        observer.observe(container, mutationObserverOptions)
      }
    } catch (error) {
      onDone(error)
    }

    function onDone(error, result) {
      clearTimeout(timer)
      setImmediate(() => observer.disconnect())
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    }
    function onMutation() {
      try {
        const result = callback()
        if (!result || (Array.isArray(result) && !result.length)) {
          onDone(null, true)
        }
        // If `callback` returns truthy value, wait for the next mutation or timeout.
      } catch (error) {
        onDone(null, true)
      }
    }
    function onTimeout() {
      onDone(new Error('Timed out in waitForElementToBeRemoved.'), null)
    }
  })
}

function waitForElementToBeRemovedWrapper(...args) {
  return getConfig().asyncWrapper(() => waitForElementToBeRemoved(...args))
}

export {waitForElementToBeRemovedWrapper as waitForElementToBeRemoved}

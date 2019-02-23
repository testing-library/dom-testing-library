import {getDocument, getSetImmediate, newMutationObserver} from './helpers'

function waitForElementToBeRemoved(
  callback,
  {
    container = getDocument(),
    timeout = 4500,
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
        'waitForElementToBeRemoved requires a callback as the first parameter',
      )
    }

    // Check if the element is not present synchronously,
    // As the name waitForElementToBeRemoved should check `present` --> `removed`
    ;(function checkElementPresent() {
      try {
        const result = callback()
        if (!result) {
          onDone(new Error('Element is not present in the DOM.'), true)
        }
      } catch (error) {
        onDone(new Error('Element is not present in the DOM.'), true)
      }
    })()

    const timer = setTimeout(onTimeout, timeout)
    const observer = newMutationObserver(onMutation)
    observer.observe(container, mutationObserverOptions)
    function onDone(error, result) {
      const setImmediate = getSetImmediate()
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
        if (!result) {
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

export {waitForElementToBeRemoved}

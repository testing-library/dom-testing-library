import 'mutationobserver-shim'

function waitForElement(
  callback = undefined,
  {
    container = document,
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
    // Disabling eslint prefer-const below: either prefer-const or no-use-before-define triggers.
    let lastError, observer, timer // eslint-disable-line prefer-const
    function onDone(error, result) {
      clearTimeout(timer)
      observer.disconnect()
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    }
    function onMutation() {
      if (callback === undefined) {
        onDone(null, undefined)
        return
      }
      try {
        const result = callback()
        if (result) {
          onDone(null, result)
        }
        // If `callback` returns falsy value, wait for the next mutation or timeout.
      } catch (error) {
        // Save the callback error to reject the promise with it.
        lastError = error
        // If `callback` throws an error, wait for the next mutation or timeout.
      }
    }
    function onTimeout() {
      onDone(lastError || new Error('Timed out in waitForElement.'), null)
    }
    timer = setTimeout(onTimeout, timeout)
    observer = new MutationObserver(onMutation)
    observer.observe(container, mutationObserverOptions)
    if (callback !== undefined) {
      onMutation()
    }
  })
}

export {waitForElement}

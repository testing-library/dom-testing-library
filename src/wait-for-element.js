import MutationObserver from '@sheerun/mutationobserver-shim'

function waitForElement(
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
      reject('waitForElement requires a callback as the first parameter')
    }
    let lastError
    const timer = setTimeout(onTimeout, timeout)
    /* istanbul ignore next */
    const MutationObserverConstructor =
      typeof window !== 'undefined' &&
      typeof window.MutationObserver !== 'undefined'
        ? window.MutationObserver
        : MutationObserver
    const observer = new MutationObserverConstructor(onMutation)
    observer.observe(container, mutationObserverOptions)
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
    onMutation()
  })
}

function getDocument() {
  /* istanbul ignore if */
  if (typeof window === 'undefined') {
    throw new Error('Could not find default container')
  }
  return window.document
}

export {waitForElement}

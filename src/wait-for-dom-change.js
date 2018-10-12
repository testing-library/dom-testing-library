import MutationObserver from '@sheerun/mutationobserver-shim'

function waitForDomChange({
  container = getDocument(),
  timeout = 4500,
  mutationObserverOptions = {
    subtree: true,
    childList: true,
    attributes: true,
    characterData: true,
  },
} = {}) {
  return new Promise((resolve, reject) => {
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
    function onMutation(mutationsList) {
      onDone(null, mutationsList)
    }
    function onTimeout() {
      onDone(new Error('Timed out in waitForDomChange.'), null)
    }
  })
}

function getDocument() {
  /* istanbul ignore if */
  if (typeof window === 'undefined') {
    throw new Error('Could not find default container')
  }
  return window.document
}

export {waitForDomChange}

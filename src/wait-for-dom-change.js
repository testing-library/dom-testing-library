import 'mutationobserver-shim'

function waitForDomChange({
  container = document,
  timeout = 4500,
  mutationObserverOptions = {
    subtree: true,
    childList: true,
    attributes: true,
    characterData: true,
  },
} = {}) {
  return new Promise((resolve, reject) => {
    // Disabling eslint prefer-const below: either prefer-const or no-use-before-define triggers.
    let lastError, observer, timer // eslint-disable-line prefer-const
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
      onDone(null, true)
    }
    function onTimeout() {
      onDone(lastError || new Error('Timed out in waitForDomChange.'), null)
    }
    timer = setTimeout(onTimeout, timeout)
    observer = new window.MutationObserver(onMutation)
    observer.observe(container, mutationObserverOptions)
  })
}

export {waitForDomChange}

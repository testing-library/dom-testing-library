import {newMutationObserver, getDocument} from './helpers'

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
    const observer = newMutationObserver(onMutation)
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

export {waitForDomChange}

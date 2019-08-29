import {
  newMutationObserver,
  getDocument,
  setImmediate,
  setTimeout,
  clearTimeout,
} from './helpers'
import {getConfig} from './config'

function waitForDomChange({
  container = getDocument(),
  timeout = getConfig().asyncUtilTimeout,
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

function waitForDomChangeWrapper(...args) {
  return getConfig().asyncWrapper(() => waitForDomChange(...args))
}

export {waitForDomChangeWrapper as waitForDomChange}

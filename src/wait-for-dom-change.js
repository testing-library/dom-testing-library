import {
  getWindowFromNode,
  getDocument,
  setImmediate,
  setTimeout,
  clearTimeout,
  runWithRealTimers,
} from './helpers'
import {getConfig} from './config'

let hasWarned = false

// deprecated... TODO: remove this method. People should use wait instead
// the reasoning is that waiting for just any DOM change is an implementation
// detail. People should be waiting for a specific thing to change.
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
  if (!hasWarned) {
    hasWarned = true
    console.warn(
      `\`waitForDomChange\` has been deprecated. Use \`wait\` instead: https://testing-library.com/docs/dom-testing-library/api-async#waitfor.`,
    )
  }
  return new Promise((resolve, reject) => {
    const timer = setTimeout(onTimeout, timeout)
    const {MutationObserver} = getWindowFromNode(container)
    const observer = new MutationObserver(onMutation)
    runWithRealTimers(() =>
      observer.observe(container, mutationObserverOptions),
    )

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

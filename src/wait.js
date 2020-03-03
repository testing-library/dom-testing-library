import {
  newMutationObserver,
  getDocument,
  setImmediate,
  setTimeout,
  clearTimeout,
  runWithRealTimers,
} from './helpers'
import {getConfig} from './config'

function wait(
  callback = () => {},
  {
    container = getDocument(),
    timeout = getConfig().asyncUtilTimeout,
    interval = 50,
    mutationObserverOptions = {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true,
    },
  } = {},
) {
  if (interval < 1) interval = 1
  return new Promise((resolve, reject) => {
    let lastError
    const overallTimeoutTimer = setTimeout(onTimeout, timeout)
    const intervalId = setInterval(checkCallback, interval)

    const observer = newMutationObserver(checkCallback)
    runWithRealTimers(() =>
      observer.observe(container, mutationObserverOptions),
    )
    checkCallback()

    function onDone(error, result) {
      clearTimeout(overallTimeoutTimer)
      clearInterval(intervalId)
      setImmediate(() => observer.disconnect())
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    }

    function checkCallback() {
      try {
        onDone(null, callback())
        // If `callback` throws, wait for the next mutation or timeout.
      } catch (error) {
        // Save the callback error to reject the promise with it.
        lastError = error
      }
    }

    function onTimeout() {
      onDone(lastError || new Error('Timed out in wait.'), null)
    }
  })
}

function waitWrapper(...args) {
  return getConfig().asyncWrapper(() => wait(...args))
}

export {waitWrapper as wait}

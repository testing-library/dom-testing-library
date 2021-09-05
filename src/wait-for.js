import {
  getWindowFromNode,
  getDocument,
  jestFakeTimersAreEnabled,
  // We import these from the helpers rather than using the global version
  // because these will be *real* timers, regardless of whether we're in
  // an environment that's faked the timers out.
  checkContainerType,
} from './helpers'
import {getConfig, runWithExpensiveErrorDiagnosticsDisabled} from './config'

// This is so the stack trace the developer sees is one that's
// closer to their code (because async stack traces are hard to follow).
function copyStackTrace(target, source) {
  target.stack = source.stack.replace(source.message, target.message)
}

function waitFor(
  callback,
  {
    container = getDocument(),
    timeout = getConfig().asyncUtilTimeout,
    showOriginalStackTrace = getConfig().showOriginalStackTrace,
    stackTraceError,
    interval = 50,
    onTimeout = error => {
      error.message = getConfig().getElementError(
        error.message,
        container,
      ).message
      return error
    },
    mutationObserverOptions = {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true,
    },
  },
) {
  if (typeof callback !== 'function') {
    throw new TypeError('Received `callback` arg must be a function')
  }

  return new Promise(async (resolve, reject) => {
    let lastError, observer
    let finished = false
    let promiseStatus = 'idle'

    const overallTimeout = setTimeout(handleTimeout, timeout)
    const intervalId = setInterval(handleInterval, interval)
    checkCallback()

    const wasUsingJestFakeTimers = jestFakeTimersAreEnabled()
    if (wasUsingJestFakeTimers) {
      // this is a dangerous rule to disable because it could lead to an
      // infinite loop. However, eslint isn't smart enough to know that we're
      // setting finished inside `onDone` which will be called when we're done
      // waiting or when we've timed out.
      // eslint-disable-next-line no-unmodified-loop-condition
      while (!finished) {
        try {
          // jest.advanceTimersByTime will not throw if
          ensureInvariantTimers()
        } catch (error) {
          reject(error)
          return
        }
        // we *could* (maybe should?) use `advanceTimersToNextTimer` but it's
        // possible that could make this loop go on forever if someone is using
        // third party code that's setting up recursive timers so rapidly that
        // the user's timer's don't get a chance to resolve. So we'll advance
        // by an interval instead. (We have a test for this case).
        jest.advanceTimersByTime(interval)

        // In this rare case, we *need* to wait for in-flight promises
        // to resolve before continuing. We don't need to take advantage
        // of parallelization so we're fine.
        // https://stackoverflow.com/a/59243586/971592
        // eslint-disable-next-line no-await-in-loop
        await new Promise(r => {
          setTimeout(r, 0)
          jest.advanceTimersByTime(0)
        })
      }
    } else {
      try {
        checkContainerType(container)
      } catch (e) {
        reject(e)
        return
      }
      const {MutationObserver} = getWindowFromNode(container)
      observer = new MutationObserver(handleInterval)
      observer.observe(container, mutationObserverOptions)
    }

    function onDone(error, result) {
      finished = true
      clearTimeout(overallTimeout)
      clearInterval(intervalId)

      if (observer !== undefined) {
        observer.disconnect()
      }

      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    }

    function ensureInvariantTimers() {
      const isUsingJestFakeTimers = jestFakeTimersAreEnabled()
      if (wasUsingJestFakeTimers !== isUsingJestFakeTimers) {
        const error = new Error(
          `Changed from using ${
            wasUsingJestFakeTimers ? 'fake timers' : 'real timers'
          } to ${
            isUsingJestFakeTimers ? 'fake timers' : 'real timers'
          } while using waitFor. This is not allowed and will result in very strange behavior. Please ensure you're awaiting all async things your test is doing before changing what timers your test is using. For more info, please go to https://github.com/testing-library/dom-testing-library/issues/830`,
        )
        if (!showOriginalStackTrace) copyStackTrace(error, stackTraceError)
        throw error
      }
    }

    function handleInterval() {
      try {
        ensureInvariantTimers()
        return checkCallback()
      } catch (error) {
        return reject(error)
      }
    }

    function checkCallback() {
      if (promiseStatus === 'pending') return
      try {
        const result = runWithExpensiveErrorDiagnosticsDisabled(callback)
        if (typeof result?.then === 'function') {
          promiseStatus = 'pending'
          result.then(
            resolvedValue => {
              promiseStatus = 'resolved'
              onDone(null, resolvedValue)
            },
            rejectedValue => {
              promiseStatus = 'rejected'
              lastError = rejectedValue
            },
          )
        } else {
          onDone(null, result)
        }
        // If `callback` throws, wait for the next mutation, interval, or timeout.
      } catch (error) {
        // Save the most recent callback error to reject the promise with it in the event of a timeout
        lastError = error
      }
    }

    function handleTimeout() {
      let error
      if (lastError) {
        error = lastError
        if (
          !showOriginalStackTrace &&
          error.name === 'TestingLibraryElementError'
        ) {
          copyStackTrace(error, stackTraceError)
        }
      } else {
        error = new Error('Timed out in waitFor.')
        if (!showOriginalStackTrace) {
          copyStackTrace(error, stackTraceError)
        }
      }
      onDone(onTimeout(error), null)
    }
  })
}

function waitForWrapper(callback, options) {
  // create the error here so its stack trace is as close to the
  // calling code as possible
  const stackTraceError = new Error('STACK_TRACE_MESSAGE')
  return getConfig().asyncWrapper(() =>
    waitFor(callback, {stackTraceError, ...options}),
  )
}

export {waitForWrapper as waitFor}

/*
eslint
  max-lines-per-function: ["error", {"max": 200}],
*/

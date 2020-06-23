import {
  getWindowFromNode,
  getDocument,
  jestFakeTimersAreEnabled,
  // We import these from the helpers rather than using the global version
  // because these will be *real* timers, regardless of whether we're in
  // an environment that's faked the timers out.
  setImmediate,
  setTimeout,
  clearTimeout,
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
    let lastError, intervalId, observer
    let finished = false

    const overallTimeoutTimer = setTimeout(onTimeout, timeout)

    const usingFakeTimers = jestFakeTimersAreEnabled()
    if (usingFakeTimers) {
      checkCallback()
      // this is a dangerous rule to disable because it could lead to an
      // infinite loop. However, eslint isn't smart enough to know that we're
      // setting finished inside `onDone` which will be called when we're done
      // waiting or when we've timed out.
      // eslint-disable-next-line no-unmodified-loop-condition
      while (!finished) {
        // we *could* (maybe should?) use `advanceTimersToNextTimer` but it's
        // possible that could make this loop go on forever if someone is using
        // third party code that's setting up recursive timers so rapidly that
        // the user's timer's don't get a chance to resolve. So we'll advance
        // by an interval instead. (We have a test for this case).
        jest.advanceTimersByTime(interval)

        // It's really important that checkCallback is run *before* we flush
        // in-flight promises. To be honest, I'm not sure why, and I can't quite
        // think of a way to reproduce the problem in a test, but I spent
        // an entire day banging my head against a wall on this.
        checkCallback()

        // In this rare case, we *need* to wait for in-flight promises
        // to resolve before continuing. We don't need to take advantage
        // of parallelization so we're fine.
        // https://stackoverflow.com/a/59243586/971592
        // eslint-disable-next-line no-await-in-loop
        await new Promise(r => setImmediate(r))
      }
    } else {
      intervalId = setInterval(checkCallback, interval)
      const {MutationObserver} = getWindowFromNode(container)
      observer = new MutationObserver(checkCallback)
      observer.observe(container, mutationObserverOptions)
      checkCallback()
    }

    function onDone(error, result) {
      finished = true
      clearTimeout(overallTimeoutTimer)

      if (!usingFakeTimers) {
        clearInterval(intervalId)
        setImmediate(() => observer.disconnect())
      }

      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    }

    function checkCallback() {
      try {
        onDone(null, runWithExpensiveErrorDiagnosticsDisabled(callback))
        // If `callback` throws, wait for the next mutation, interval, or timeout.
      } catch (error) {
        // Save the most recent callback error to reject the promise with it in the event of a timeout
        lastError = error
      }
    }

    function onTimeout() {
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
      onDone(error, null)
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

let hasWarned = false

// deprecated... TODO: remove this method. We renamed this to `waitFor` so the
// code people write reads more clearly.
function wait(...args) {
  // istanbul ignore next
  const [first = () => {}, ...rest] = args
  if (!hasWarned) {
    hasWarned = true
    console.warn(
      `\`wait\` has been deprecated and replaced by \`waitFor\` instead. In most cases you should be able to find/replace \`wait\` with \`waitFor\`. Learn more: https://testing-library.com/docs/dom-testing-library/api-async#waitfor.`,
    )
  }
  return waitForWrapper(first, ...rest)
}

export {waitForWrapper as waitFor, wait}

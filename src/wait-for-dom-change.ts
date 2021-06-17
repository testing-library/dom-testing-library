import {waitForOptions} from '../types'
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
}: waitForOptions = {}) {
  if (!hasWarned) {
    hasWarned = true
    console.warn(
      `\`waitForDomChange\` has been deprecated. Use \`waitFor\` instead: https://testing-library.com/docs/dom-testing-library/api-async#waitfor.`,
    )
  }
  return new Promise((resolve, reject) => {
    const timer = setTimeout(onTimeout, timeout)
    const {MutationObserver} = getWindowFromNode(container)
    const observer = new MutationObserver(onMutation)
    runWithRealTimers(() =>
      observer.observe(container, mutationObserverOptions),
    )

    function onDone(error: Error | null, result: MutationRecord[] | null) {
      ;(clearTimeout as (t: NodeJS.Timeout | number) => void)(timer)
      setImmediate(() => observer.disconnect())
      if (error) {
        reject(error)
      } else {
        // either error or result is null, so if error is null then result is not
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        resolve(result!)
      }
    }

    function onMutation(mutationsList: MutationRecord[]) {
      onDone(null, mutationsList)
    }

    function onTimeout() {
      onDone(new Error('Timed out in waitForDomChange.'), null)
    }
  })
}

function waitForDomChangeWrapper(options?: waitForOptions) {
  return getConfig().asyncWrapper(() => waitForDomChange(options))
}

export {waitForDomChangeWrapper as waitForDomChange}

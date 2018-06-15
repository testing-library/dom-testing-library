import waitForExpect from 'wait-for-expect'
import {waitForElement} from './wait-for-element'

const noop = () => {}

function wait(
  callback = undefined,
  {
    timeout = 4500,
    interval = 50,

    // waitForElement will handle the default options for the following properties.
    container,
    mutationObserverOptions,
  } = {},
) {
  return container
    ? waitForElement(callback, {container, timeout, mutationObserverOptions})
    : waitForExpect(callback || noop, timeout, interval)
}

export {wait}

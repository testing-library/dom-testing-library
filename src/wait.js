import waitForExpect from 'wait-for-expect'
import {getConfig} from './config'

function wait(callback = () => {}, {timeout = 4500, interval = 50} = {}) {
  return waitForExpect(callback, timeout, interval)
}

function waitWrapper(...args) {
  return getConfig().asyncWrapper(() => wait(...args))
}

export {waitWrapper as wait}

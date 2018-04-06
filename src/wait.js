import waitForExpect from 'wait-for-expect'

function wait(callback = () => {}, {timeout = 4500, interval = 50} = {}) {
  return waitForExpect(callback, timeout, interval)
}

export {wait}

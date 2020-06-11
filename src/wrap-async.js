import {getConfig} from './config'

function wrapAsync(fn) {
  async function wrapper(...args) {
    let result
    await getConfig().asyncWrapper(async () => {
      result = await fn(...args)
    })
    return result
  }
  // give it a helpful name for debugging
  Object.defineProperty(wrapper, 'name', {value: `${fn.name}Wrapper`})
  return wrapper
}

export {wrapAsync}

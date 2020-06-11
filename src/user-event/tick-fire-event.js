import {fireEvent as baseFireEvent} from '../events'
import {tick} from './tick'

async function fireEvent(...args) {
  await tick()
  return baseFireEvent(...args)
}

Object.keys(baseFireEvent).forEach(key => {
  async function asyncFireEventWrapper(...args) {
    await tick()
    return baseFireEvent[key](...args)
  }
  Object.defineProperty(asyncFireEventWrapper, 'name', {value: key})
  fireEvent[key] = asyncFireEventWrapper
})

export {fireEvent}

import {buildQueries} from './all-utils'

const internalQueryAllDescriptionsOf = (container, element) =>
  container.querySelectorAll(`#${element.getAttribute('aria-describedby')}`)

const getMultipleError = () =>
  'Found multiple descriptions. An element should be described by a unique element.'
const getMissingError = (container, element) =>
  `The container should include an element with the id '${element.getAttribute(
    'aria-describedby',
  )}' but there was none.`

const [
  queryDescriptionOf,
  ,
  getDescriptionOf,
  ,
  findDescriptionOf,
] = buildQueries(
  internalQueryAllDescriptionsOf,
  getMultipleError,
  getMissingError,
)

const createPreferOtherMethod = methodName => {
  return () => {
    throw new Error(
      `An element should be described by a unique element. If you want to expect that only a single element exists prefer ${methodName} and expect an error thrown.`,
    )
  }
}

const queryAllDescriptionOf = createPreferOtherMethod('queryDescriptionOf')
const getAllDescriptionOf = createPreferOtherMethod('getDescriptionOf')
const findAllDescriptionOf = createPreferOtherMethod('findDescriptionOf')

export {
  queryDescriptionOf,
  queryAllDescriptionOf,
  getAllDescriptionOf,
  getDescriptionOf,
  findAllDescriptionOf,
  findDescriptionOf,
}

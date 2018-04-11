import * as queries from './queries'

function bindQueriesToElement(element) {
  return Object.entries(queries).reduce(
    (helpers, [key, fn]) => {
      helpers[key] = fn.bind(null, element)      
      return helpers
    },
    {},
  )
}

export {bindQueriesToElement}

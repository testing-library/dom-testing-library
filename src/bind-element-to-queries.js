import * as queries from './queries'

function bindElementToQueries(element) {
  return Object.entries(queries).reduce(
    (helpers, [key, fn]) => {
      helpers[key] = fn.bind(null, element)      
      return helpers
    },
    {},
  )
}

export {bindElementToQueries}

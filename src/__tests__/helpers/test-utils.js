import * as queries from '../../queries'

function render(html) {
  const container = document.createElement('div')
  container.innerHTML = html
  const containerQueries = Object.entries(queries).reduce(
    (helpers, [key, fn]) => {
      helpers[key] = fn.bind(null, container)
      return helpers
    },
    {},
  )
  return {container, ...containerQueries}
}

export {render}

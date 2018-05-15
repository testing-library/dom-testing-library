import {getQueriesForElement} from '../../get-queries-for-element'

function render(html) {
  const container = document.createElement('div')
  container.innerHTML = html
  const containerQueries = getQueriesForElement(container)
  return {container, ...containerQueries}
}

export {render}

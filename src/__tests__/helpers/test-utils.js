import {getQueriesForElement} from '../../get-queries-for-element'
import document from './document'

function render(html) {
  const container = document.createElement('div')
  container.innerHTML = html
  const containerQueries = getQueriesForElement(container)
  return {container, ...containerQueries}
}

export {render}

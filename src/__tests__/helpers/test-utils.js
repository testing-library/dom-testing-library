import {getQueriesForElement} from '../../get-queries-for-element'
import document from './document'

function render(html) {
  const container = document.createElement('div')
  container.innerHTML = html
  const containerQueries = getQueriesForElement(container)
  return {container, ...containerQueries}
}

function renderIntoDocument(html) {
  document.body.innerHTML = html
  const containerQueries = getQueriesForElement(document)
  return {container: document, ...containerQueries}
}

export {render, renderIntoDocument}

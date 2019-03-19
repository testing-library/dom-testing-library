import {getQueriesForElement} from '../../get-queries-for-element'

function render(html, {container = document.createElement('div')} = {}) {
  container.innerHTML = html
  const containerQueries = getQueriesForElement(container)
  function rerender(newHtml) {
    return render(newHtml, {container})
  }
  return {container, rerender, ...containerQueries}
}

function renderIntoDocument(html) {
  document.body.innerHTML = html
  const containerQueries = getQueriesForElement(document)
  return {container: document, ...containerQueries}
}

export {render, renderIntoDocument}

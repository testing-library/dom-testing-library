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
  return render(html, {container: document.body})
}

function cleanup() {
  document.body.innerHTML = ''
}

export {render, renderIntoDocument, cleanup}

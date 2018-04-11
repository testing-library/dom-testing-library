import {bindQueriesToElement} from '../../bind-queries-to-element'

function render(html) {
  const container = document.createElement('div')
  container.innerHTML = html
  const containerQueries = bindQueriesToElement(container)
  return {container, ...containerQueries}
}

export {render}

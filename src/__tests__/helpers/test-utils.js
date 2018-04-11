import {bindElementToQueries} from '../../bind-element-to-queries'

function render(html) {
  const container = document.createElement('div')
  container.innerHTML = html
  const containerQueries = bindElementToQueries(container)
  return {container, ...containerQueries}
}

export {render}

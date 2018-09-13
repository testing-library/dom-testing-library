import {getQueriesForElement, queries} from 'dom-testing-library'
import * as asyncQueries from '../../'

const allQueries = {
  ...queries,
  ...asyncQueries,
}

function render(html) {
  const container = document.createElement('div')
  container.innerHTML = html
  const containerQueries = getQueriesForElement(container, allQueries)
  return {container, ...containerQueries}
}

export {render}

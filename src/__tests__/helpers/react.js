import ReactDOM from 'react-dom'

const node = document.body.appendChild(document.createElement('div'))

function mount(element) {
  ReactDOM.render(element, node)
}

function unmount() {
  ReactDOM.unmountComponentAtNode(node)
}

export {mount, unmount}

import {TEXT_NODE} from './helpers'

function getNodeText(node: HTMLElement): string {
  if (node.matches('input[type=submit], input[type=button]')) {
    return (node as HTMLInputElement).value
  }

  return Array.from(node.childNodes)
    .filter(child => child.nodeType === TEXT_NODE && Boolean(child.textContent))
    .map(c => c.textContent)
    .join('')
}

export {getNodeText}

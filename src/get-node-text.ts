import {TEXT_NODE} from './helpers'

function getNodeText(node: HTMLElement): string {
  if (
    node.localName.toLowerCase() === 'input' &&
    node.matches('input[type=submit], input[type=button], input[type=reset]')
  ) {
    return (node as HTMLInputElement).value
  }

  let text = ''
  for (const child of node.childNodes) {
    if (child.nodeType === TEXT_NODE) {
      text += (child as Text).data
    }
  }
  return text
}

export {getNodeText}

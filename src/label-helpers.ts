import {isNotNull} from './utils'
import {TEXT_NODE} from './helpers'

const labelledNodeNames = [
  'button',
  'meter',
  'output',
  'progress',
  'select',
  'textarea',
  'input',
]

function getTextContent(
  node: Node | Element | HTMLInputElement,
): string | null {
  if (labelledNodeNames.includes(node.nodeName.toLowerCase())) {
    return ''
  }

  if (node.nodeType === TEXT_NODE) return node.textContent

  return Array.from(node.childNodes)
    .map(childNode => getTextContent(childNode))
    .join('')
}

function getLabelContent(node: Node | Element | HTMLInputElement) {
  let textContent
  if ('tagName' in node && node.tagName.toLowerCase() === 'label') {
    textContent = getTextContent(node)
  } else if ('value' in node) {
    textContent = node.value
  } else {
    textContent = node.textContent
  }
  return textContent
}

// Based on https://github.com/eps1lon/dom-accessibility-api/pull/352
function getRealLabels(element: Element | HTMLInputElement) {
  // for old browsers
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if ('labels' in element && element.labels !== undefined)
    return element.labels ?? []

  if (!isLabelable(element)) return []

  const labels = element.ownerDocument.querySelectorAll('label')
  return Array.from(labels).filter(label => label.control === element)
}

function isLabelable(element: Element) {
  const labelableRegex = /BUTTON|METER|OUTPUT|PROGRESS|SELECT|TEXTAREA/
  return (
    labelableRegex.test(element.tagName) ||
    (element.tagName === 'INPUT' && element.getAttribute('type') !== 'hidden')
  )
}

function getLabels(
  container: Element,
  element: Element,
  {selector = '*'} = {},
) {
  const ariaLabelledBy = element.getAttribute('aria-labelledby')
  const labelsId = isNotNull(ariaLabelledBy) ? ariaLabelledBy.split(' ') : []
  return labelsId.length
    ? labelsId.map(labelId => {
        const labellingElement = container.querySelector(`[id="${labelId}"]`)
        return labellingElement
          ? {content: getLabelContent(labellingElement), formControl: null}
          : {content: '', formControl: null}
      })
    : Array.from(getRealLabels(element)).map(label => {
        const textToMatch = getLabelContent(label)
        const formControlSelector =
          'button, input, meter, output, progress, select, textarea'
        const labelledFormControl = Array.from(
          label.querySelectorAll(formControlSelector),
        ).filter(formControlElement => formControlElement.matches(selector))[0]
        return {content: textToMatch, formControl: labelledFormControl}
      })
}

export {getLabels, getRealLabels, getLabelContent}

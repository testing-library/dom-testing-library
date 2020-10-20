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

function getTextContent(node) {
  if (labelledNodeNames.includes(node.nodeName.toLowerCase())) {
    return ''
  }

  if (node.nodeType === TEXT_NODE) return node.textContent

  return Array.from(node.childNodes)
    .map(childNode => getTextContent(childNode))
    .join('')
}

function getLabelContent(node) {
  let textContent
  if (node.tagName.toLowerCase() === 'label') {
    textContent = getTextContent(node)
  } else {
    textContent = node.value || node.textContent
  }
  return textContent
}

// Based on https://github.com/eps1lon/dom-accessibility-api/pull/352
function getRealLabels(element) {
  if (element.labels !== undefined) return element.labels

  if (!isLabelable(element)) return []

  const labels = element.ownerDocument.querySelectorAll('label')
  return Array.from(labels).filter(label => label.control === element)
}

function isLabelable(element) {
  return (
    element.tagName.match(/BUTTON|METER|OUTPUT|PROGRESS|SELECT|TEXTAREA/) ||
    (element.tagName === 'INPUT' && element.getAttribute('type') !== 'hidden')
  )
}

function getLabels(container, element, {selector = '*'} = {}) {
  const labelsId = element.getAttribute('aria-labelledby')
    ? element.getAttribute('aria-labelledby').split(' ')
    : []
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

import {wrapAsync} from '../wrap-async'
import {fireEvent, getMouseEventOptions} from './utils'

function getPreviouslyFocusedElement(element) {
  const focusedElement = element.ownerDocument.activeElement
  const wasAnotherElementFocused =
    focusedElement &&
    focusedElement !== element.ownerDocument.body &&
    focusedElement !== element
  return wasAnotherElementFocused ? focusedElement : null
}

async function clickLabel(label, init) {
  await fireEvent.mouseOver(label, getMouseEventOptions('mouseover', init))
  await fireEvent.mouseMove(label, getMouseEventOptions('mousemove', init))
  await fireEvent.mouseDown(label, getMouseEventOptions('mousedown', init))
  await fireEvent.mouseUp(label, getMouseEventOptions('mouseup', init))
  await fireEvent.click(label, getMouseEventOptions('click', init))

  // clicking the label will trigger a click of the label.control
  // however, it will not focus the label.control so we have to do it
  // ourselves.
  if (label.control) label.control.focus()
}

async function clickBooleanElement(element, init) {
  if (element.disabled) return

  await fireEvent.mouseOver(element, getMouseEventOptions('mouseover', init))
  await fireEvent.mouseMove(element, getMouseEventOptions('mousemove', init))
  await fireEvent.mouseDown(element, getMouseEventOptions('mousedown', init))
  await fireEvent.focus(element)
  await fireEvent.mouseUp(element, getMouseEventOptions('mouseup', init))
  await fireEvent.click(element, getMouseEventOptions('click', init))
}

async function clickElement(element, init) {
  const previousElement = getPreviouslyFocusedElement(element)
  await fireEvent.mouseOver(element, getMouseEventOptions('mouseover', init))
  await fireEvent.mouseMove(element, getMouseEventOptions('mousemove', init))
  const continueDefaultHandling = await fireEvent.mouseDown(
    element,
    getMouseEventOptions('mousedown', init),
  )
  const shouldFocus = element.ownerDocument.activeElement !== element
  if (continueDefaultHandling) {
    if (previousElement) {
      previousElement.blur()
      await fireEvent.focusOut(previousElement)
    }
    if (shouldFocus) {
      element.focus()
      await fireEvent.focusIn(element)
    }
  }
  await fireEvent.mouseUp(element, getMouseEventOptions('mouseup', init))
  await fireEvent.click(element, getMouseEventOptions('click', init, 1))
  const parentLabel = element.closest('label')
  if (parentLabel?.control) parentLabel?.control.focus?.()
}

async function dblClickElement(element, init) {
  const previousElement = getPreviouslyFocusedElement(element)
  await fireEvent.mouseOver(element, getMouseEventOptions('mouseover', init))
  await fireEvent.mouseMove(element, getMouseEventOptions('mousemove', init))
  const continueDefaultHandling = await fireEvent.mouseDown(
    element,
    getMouseEventOptions('mousedown', init),
  )
  const shouldFocus = element.ownerDocument.activeElement !== element
  if (continueDefaultHandling) {
    if (previousElement) previousElement.blur()
    if (shouldFocus) element.focus()
  }
  await fireEvent.mouseUp(element, getMouseEventOptions('mouseup', init))
  await fireEvent.click(element, getMouseEventOptions('click', init, 1))
  const parentLabel = element.closest('label')
  if (parentLabel?.control) parentLabel?.control.focus?.()

  await fireEvent.mouseDown(element, getMouseEventOptions('mousedown', init, 1))
  await fireEvent.mouseUp(element, getMouseEventOptions('mouseup', init, 1))
  await fireEvent.click(element, getMouseEventOptions('click', init, 2))
  await fireEvent.dblClick(element, getMouseEventOptions('dblclick', init, 2))
}

async function dblClickCheckbox(checkbox, init) {
  await fireEvent.mouseOver(checkbox, getMouseEventOptions('mouseover', init))
  await fireEvent.mouseMove(checkbox, getMouseEventOptions('mousemove', init))
  await fireEvent.mouseDown(checkbox, getMouseEventOptions('mousedown', init))
  await fireEvent.focus(checkbox)
  await fireEvent.mouseUp(checkbox, getMouseEventOptions('mouseup', init))
  await fireEvent.click(checkbox, getMouseEventOptions('click', init, 1))
  await fireEvent.mouseDown(
    checkbox,
    getMouseEventOptions('mousedown', init, 1),
  )
  await fireEvent.mouseUp(checkbox, getMouseEventOptions('mouseup', init, 1))
  await fireEvent.click(checkbox, getMouseEventOptions('click', init, 2))
}

async function click(element, init) {
  switch (element.tagName) {
    case 'LABEL':
      await clickLabel(element, init)
      break
    case 'INPUT':
      if (element.type === 'checkbox' || element.type === 'radio') {
        await clickBooleanElement(element, init)
        break
      }
    // eslint-disable-next-line no-fallthrough
    default:
      await clickElement(element, init)
  }
}
click = wrapAsync(click)

async function dblClick(element, init) {
  switch (element.tagName) {
    case 'INPUT':
      if (element.type === 'checkbox') {
        await dblClickCheckbox(element, init)
        break
      }
    // eslint-disable-next-line no-fallthrough
    default:
      await dblClickElement(element, init)
  }
}
dblClick = wrapAsync(dblClick)

export {
  click,
  dblClick,
  clickLabel,
  clickBooleanElement,
  clickElement,
  dblClickElement,
  dblClickCheckbox,
}

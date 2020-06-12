import {wrapAsync} from '../wrap-async'
import {fireEvent, getActiveElement, isFocusable} from './utils'

async function focus(element, init) {
  if (!isFocusable(element)) return

  const isAlreadyActive = getActiveElement(element.ownerDocument) === element
  if (isAlreadyActive) return

  element.focus()
  await fireEvent.focusIn(element, init)
}
focus = wrapAsync(focus)

export {focus}

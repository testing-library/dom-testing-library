import {wrapAsync} from '../wrap-async'
import {fireEvent, getActiveElement, isFocusable} from './utils'

async function blur(element, init) {
  if (!isFocusable(element)) return

  const wasActive = getActiveElement(element.ownerDocument) === element
  if (!wasActive) return

  element.blur()
  await fireEvent.focusOut(element, init)
}
blur = wrapAsync(blur)

export {blur}

import {wrapAsync} from '../wrap-async'
import {
  fireEvent,
  isLabelWithInternallyDisabledControl,
  getMouseEventOptions,
} from './utils'

async function hover(element, init) {
  if (isLabelWithInternallyDisabledControl(element)) return

  await fireEvent.pointerOver(element, init)
  await fireEvent.pointerEnter(element, init)
  if (!element.disabled) {
    await fireEvent.mouseOver(element, getMouseEventOptions('mouseover', init))
    await fireEvent.mouseEnter(
      element,
      getMouseEventOptions('mouseenter', init),
    )
  }
  await fireEvent.pointerMove(element, init)
  if (!element.disabled) {
    await fireEvent.mouseMove(element, getMouseEventOptions('mousemove', init))
  }
}
hover = wrapAsync(hover)

async function unhover(element, init) {
  if (isLabelWithInternallyDisabledControl(element)) return

  await fireEvent.pointerMove(element, init)
  if (!element.disabled) {
    await fireEvent.mouseMove(element, getMouseEventOptions('mousemove', init))
  }
  await fireEvent.pointerOut(element, init)
  await fireEvent.pointerLeave(element, init)
  if (!element.disabled) {
    await fireEvent.mouseOut(element, getMouseEventOptions('mouseout', init))
    await fireEvent.mouseLeave(
      element,
      getMouseEventOptions('mouseleave', init),
    )
  }
}
unhover = wrapAsync(unhover)

export {hover, unhover}

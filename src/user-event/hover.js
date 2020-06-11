import {wrapAsync} from '../wrap-async'
import {fireEvent, getMouseEventOptions} from './utils'

async function hover(element, init) {
  await fireEvent.mouseOver(element, getMouseEventOptions('mouseover', init))
  await fireEvent.mouseEnter(element, getMouseEventOptions('mouseenter', init))
  await fireEvent.mouseMove(element, getMouseEventOptions('mousemove', init))
}
hover = wrapAsync(hover)

async function unhover(element, init) {
  await fireEvent.mouseMove(element, getMouseEventOptions('mousemove', init))
  await fireEvent.mouseOut(element, getMouseEventOptions('mouseout', init))
  await fireEvent.mouseLeave(element, getMouseEventOptions('mouseleave', init))
}
unhover = wrapAsync(unhover)

export {hover, unhover}

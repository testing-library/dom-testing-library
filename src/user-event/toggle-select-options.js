import {wrapAsync} from '../wrap-async'
import {
  fireEvent,
  getMouseEventOptions,
  getPreviouslyFocusedElement,
} from './utils'
import {clickElement} from './click'

async function toggleSelectOption(select, option, init) {
  await fireEvent.mouseOver(option, getMouseEventOptions('mouseover', init))
  await fireEvent.mouseMove(option, getMouseEventOptions('mousemove', init))
  await fireEvent.mouseDown(option, getMouseEventOptions('mousedown', init))
  await fireEvent.focus(option)
  await fireEvent.mouseUp(option, getMouseEventOptions('mouseup', init))
  await fireEvent.click(option, getMouseEventOptions('click', init, 1))

  option.selected = !option.selected

  await fireEvent.change(select)
}

async function toggleSelectOptions(element, values, init) {
  if (!element || element.tagName !== 'SELECT' || !element.multiple) {
    throw new Error(
      `Unable to toggleSelectOptions - please provide a select element with multiple=true`,
    )
  }

  const previouslyFocusedElement = getPreviouslyFocusedElement(element)
  if (previouslyFocusedElement) {
    await fireEvent.mouseMove(
      previouslyFocusedElement,
      getMouseEventOptions('mousemove', init),
    )
    await fireEvent.mouseLeave(
      previouslyFocusedElement,
      getMouseEventOptions('mouseleave', init),
    )
  }

  await clickElement(element, previouslyFocusedElement, init)

  const valArray = Array.isArray(values) ? values : [values]
  const selectedOptions = Array.from(element.querySelectorAll('option')).filter(
    opt => valArray.includes(opt.value) || valArray.includes(opt),
  )

  if (selectedOptions.length > 0) {
    for (const option of selectedOptions) {
      await toggleSelectOption(element, option, init)
    }
  }
}
toggleSelectOptions = wrapAsync(toggleSelectOptions)

export {toggleSelectOptions}

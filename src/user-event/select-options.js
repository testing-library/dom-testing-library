import {wrapAsync} from '../wrap-async'
import {
  fireEvent,
  getMouseEventOptions,
  getPreviouslyFocusedElement,
} from './utils'
import {clickElement} from './click'

async function selectOption(select, option, init) {
  await fireEvent.mouseOver(option, getMouseEventOptions('mouseover', init))
  await fireEvent.mouseMove(option, getMouseEventOptions('mousemove', init))
  await fireEvent.mouseDown(option, getMouseEventOptions('mousedown', init))
  await fireEvent.focus(option)
  await fireEvent.mouseUp(option, getMouseEventOptions('mouseup', init))
  await fireEvent.click(option, getMouseEventOptions('click', init, 1))

  option.selected = true

  await fireEvent.change(select)
}

async function selectOptions(element, values, init) {
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
    if (element.multiple) {
      for (const option of selectedOptions) {
        await selectOption(element, option)
      }
    } else {
      await selectOption(element, selectedOptions[0])
    }
  }
}
selectOptions = wrapAsync(selectOptions)

export {selectOptions}

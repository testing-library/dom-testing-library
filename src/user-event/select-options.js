import {wrapAsync} from '../wrap-async'
import {createEvent} from '../events'
import {getConfig} from '../config'
import {fireEvent} from './utils'
import {click} from './click'
import {focus} from './focus'

async function selectOptionsBase(newValue, select, values, init) {
  if (!newValue && !select.multiple) {
    throw getConfig().getElementError(
      `Unable to deselect an option in a non-multiple select. Use selectOptions to change the selection instead.`,
      select,
    )
  }
  const valArray = Array.isArray(values) ? values : [values]
  const allOptions = Array.from(select.querySelectorAll('option'))
  const selectedOptions = valArray.map(val => {
    if (allOptions.includes(val)) {
      return val
    } else {
      const matchingOption = allOptions.find(o => o.value === val)
      if (matchingOption) {
        return matchingOption
      } else {
        throw getConfig().getElementError(
          `Value "${val}" not found in options`,
          select,
        )
      }
    }
  })

  if (select.multiple) {
    for (const option of selectedOptions) {
      // events fired for multiple select are weird. Can't use hover...
      await fireEvent.pointerOver(option, init)
      await fireEvent.pointerEnter(select, init)
      await fireEvent.mouseOver(option)
      await fireEvent.mouseEnter(select)
      await fireEvent.pointerMove(option, init)
      await fireEvent.mouseMove(option, init)
      await fireEvent.pointerDown(option, init)
      await fireEvent.mouseDown(option, init)
      await focus(select, init)
      await fireEvent.pointerUp(option, init)
      await fireEvent.mouseUp(option, init)
      await selectOption(option)
      await fireEvent.click(option, init)
    }
  } else if (selectedOptions.length === 1) {
    await click(select, init)
    await selectOption(selectedOptions[0])
  } else {
    throw getConfig().getElementError(
      `Cannot select multiple options on a non-multiple select`,
      select,
    )
  }

  async function selectOption(option) {
    option.selected = newValue
    await fireEvent(select, createEvent('input', select, init))
    await fireEvent(select, createEvent('change', select, init))
  }
}

const selectOptions = wrapAsync(selectOptionsBase.bind(null, true))
const deselectOptions = wrapAsync(selectOptionsBase.bind(null, false))

export {selectOptions, deselectOptions}

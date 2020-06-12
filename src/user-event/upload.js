import {wrapAsync} from '../wrap-async'
import {createEvent} from '../events'
import {fireEvent} from './utils'
import {click} from './click'
import {blur} from './blur'
import {focus} from './focus'

async function upload(element, fileOrFiles, init) {
  if (element.disabled) return

  let files
  let input = element

  await click(element, init)
  if (element.tagName === 'LABEL') {
    files = element.control.multiple ? fileOrFiles : [fileOrFiles]
    input = element.control
  } else {
    files = element.multiple ? fileOrFiles : [fileOrFiles]
  }

  // blur fires when the file selector pops up
  await blur(element, init)
  // focus fires when they make their selection
  await focus(element, init)

  // the event fired in the browser isn't actually an "input" or "change" event
  // but a new Event with a type set to "input" and "change"
  // Kinda odd...
  const inputFiles = {
    length: files.length,
    item: index => files[index],
    ...files,
  }

  await fireEvent(
    input,
    createEvent('input', input, {
      target: {files: inputFiles},
      ...init,
    }),
  )

  await fireEvent(
    input,
    createEvent('change', input, {
      target: {files: inputFiles},
      ...init,
    }),
  )
}
upload = wrapAsync(upload)

export {upload}

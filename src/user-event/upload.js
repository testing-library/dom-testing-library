import {wrapAsync} from '../wrap-async'
import {fireEvent} from './utils'
import {click} from './click'

async function upload(element, fileOrFiles, {clickInit, changeInit} = {}) {
  if (element.disabled) return

  let files
  let input = element

  await click(element, clickInit)
  if (element.tagName === 'LABEL') {
    files = element.control.multiple ? fileOrFiles : [fileOrFiles]
    input = element.control
  } else {
    files = element.multiple ? fileOrFiles : [fileOrFiles]
  }

  await fireEvent.change(input, {
    target: {
      files: {
        length: files.length,
        item: index => files[index],
        ...files,
      },
    },
    ...changeInit,
  })
}
upload = wrapAsync(upload)

export {upload}

import {wrapAsync} from '../wrap-async'
import {fireEvent} from './utils'
import {clickLabel, clickElement} from './click'

async function upload(element, fileOrFiles, {clickInit, changeInit} = {}) {
  if (element.disabled) return
  const focusedElement = element.ownerDocument.activeElement

  let files

  if (element.tagName === 'LABEL') {
    await clickLabel(element)
    files = element.control.multiple ? fileOrFiles : [fileOrFiles]
  } else {
    files = element.multiple ? fileOrFiles : [fileOrFiles]
    await clickElement(element, focusedElement, clickInit)
  }

  await fireEvent.change(element, {
    target: {
      files: {
        length: files.length,
        item: index => files[index] || null,
        ...files,
      },
    },
    ...changeInit,
  })
}
upload = wrapAsync(upload)

export {upload}

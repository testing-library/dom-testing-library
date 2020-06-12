import {userEvent} from '../../'
import {setup, addListeners} from './helpers/utils'

test('should fire the correct events for input', async () => {
  const file = new File(['hello'], 'hello.png', {type: 'image/png'})
  const {element, getEventSnapshot} = setup('<input type="file" />')

  await userEvent.upload(element, file)

  expect(getEventSnapshot()).toMatchInlineSnapshot(`
    Events fired on: input[value=""]

    input[value=""] - mouseover: Left (0)
    input[value=""] - mousemove: Left (0)
    input[value=""] - mousedown: Left (0)
    input[value=""] - focus
    input[value=""] - focusin
    input[value=""] - mouseup: Left (0)
    input[value=""] - click: Left (0)
    input[value=""] - change
  `)
})

test('should fire the correct events with label', async () => {
  const file = new File(['hello'], 'hello.png', {type: 'image/png'})

  const container = document.createElement('div')
  container.innerHTML = `
    <label for="element">Element</label>
    <input type="file" id="element" />
  `

  const label = container.children[0]
  const input = container.children[1]
  const {getEventSnapshot: getLabelEventCalls} = addListeners(label)
  const {getEventSnapshot: getInputEventCalls} = addListeners(input)

  await userEvent.upload(label, file)

  expect(getLabelEventCalls()).toMatchInlineSnapshot(`
    Events fired on: label[for="element"]

    label[for="element"] - mouseover: Left (0)
    label[for="element"] - mousemove: Left (0)
    label[for="element"] - mousedown: Left (0)
    label[for="element"] - mouseup: Left (0)
    label[for="element"] - click: Left (0)
  `)
  expect(getInputEventCalls()).toMatchInlineSnapshot(`
    Events fired on: input#element[value=""]

    input#element[value=""] - click: Left (0)
    input#element[value=""] - focus
    input#element[value=""] - change
  `)
})

test('should upload the file', async () => {
  const file = new File(['hello'], 'hello.png', {type: 'image/png'})
  const {element} = setup('<input type="file" />')

  await userEvent.upload(element, file)

  expect(element.files[0]).toStrictEqual(file)
  expect(element.files.item(0)).toStrictEqual(file)
  expect(element.files).toHaveLength(1)
})

test('should upload multiple files', async () => {
  const files = [
    new File(['hello'], 'hello.png', {type: 'image/png'}),
    new File(['there'], 'there.png', {type: 'image/png'}),
  ]
  const {element} = setup('<input type="file" multiple />')

  await userEvent.upload(element, files)

  expect(element.files[0]).toStrictEqual(files[0])
  expect(element.files.item(0)).toStrictEqual(files[0])
  expect(element.files[1]).toStrictEqual(files[1])
  expect(element.files.item(1)).toStrictEqual(files[1])
  expect(element.files).toHaveLength(2)
})

test('should upload multiple files when firing on the label', async () => {
  const files = [
    new File(['hello'], 'hello.png', {type: 'image/png'}),
    new File(['there'], 'there.png', {type: 'image/png'}),
  ]
  const {element} = setup(`
    <div>
      <label for="files">files</label>
      <input id="files" type="file" multiple />
    </div>
  `)

  const label = element.children[0]
  const input = element.children[1]

  await userEvent.upload(label, files)

  expect(input.files[0]).toStrictEqual(files[0])
  expect(input.files.item(0)).toStrictEqual(files[0])
  expect(input.files[1]).toStrictEqual(files[1])
  expect(input.files.item(1)).toStrictEqual(files[1])
  expect(input.files).toHaveLength(2)
})

test('should not upload when is disabled', async () => {
  const file = new File(['hello'], 'hello.png', {type: 'image/png'})
  const {element} = setup('<input type="file" disabled />')

  await userEvent.upload(element, file)

  expect(element.files[0]).toBeUndefined()
  expect(element.files.item(0)).toBeNull()
  expect(element.files).toHaveLength(0)
})

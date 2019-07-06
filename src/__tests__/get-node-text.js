import {getNodeText} from '../get-node-text'
import {render} from './helpers/test-utils'

test('it prints out the text content of a container', () => {
  const {container} = render('Hello <!--skipped-->World!')
  expect(getNodeText(container)).toMatchInlineSnapshot(`"Hello World!"`)
})

test('it prints the value for submit and button inputs', () => {
  const {container} = render(
    '<input type="submit" value="save"><input type="button" value="reset">',
  )

  expect(getNodeText(container.firstChild)).toMatchInlineSnapshot(`"save"`)

  expect(getNodeText(container.lastChild)).toMatchInlineSnapshot(`"reset"`)
})

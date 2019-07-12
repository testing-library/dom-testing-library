import {render} from './helpers/test-utils'

test('logs available roles when it fails', () => {
  const {getByRole} = render(`<h1>Hi</h1>`)
  expect(() => getByRole('article')).toThrowErrorMatchingInlineSnapshot(`
"Unable to find an element with the role "article"

Here are the available roles:

  heading:

  <h1 />

  --------------------------------------------------

<div>
  <h1>
    Hi
  </h1>
</div>"
`)
})

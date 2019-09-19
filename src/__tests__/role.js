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

test('logs error when there are no available roles', () => {
  const {getByRole} = render('<div />')
  expect(() => getByRole('article')).toThrowErrorMatchingInlineSnapshot(`
"Unable to find an element with the role "article"

There are no available roles.

<div>
  <div />
</div>"
`)
})

test('by default excludes elements that have the html hidden attribute or any of their parents', () => {
  const {getByRole} = render('<div hidden><ul /></div>')

  expect(() => getByRole('list')).toThrowErrorMatchingInlineSnapshot(`
"Unable to find an element with the role "list"

Here are the available roles:

  list:

  <ul />

  --------------------------------------------------

<div>
  <div
    hidden=""
  >
    <ul />
  </div>
</div>"
`)
})

test('by default excludes elements which have display: none or any of their parents', () => {
  const {getByRole} = render(
    '<div style="display: none;"><ul style="display: block;" /></div>',
  )

  expect(() => getByRole('list')).toThrowErrorMatchingInlineSnapshot(`
"Unable to find an element with the role "list"

Here are the available roles:

  list:

  <ul
    style="display: block;"
  />

  --------------------------------------------------

<div>
  <div
    style="display: none;"
  >
    <ul
      style="display: block;"
    />
  </div>
</div>"
`)
})

test('by default excludes elements which have visibility hidden', () => {
  const {getByRole} = render('<div style="visibility: hidden;"><ul /></div>')

  expect(() => getByRole('list')).toThrowErrorMatchingInlineSnapshot(`
"Unable to find an element with the role "list"

Here are the available roles:

  list:

  <ul />

  --------------------------------------------------

<div>
  <div
    style="visibility: hidden;"
  >
    <ul />
  </div>
</div>"
`)
})

test('by default excludes elements which have aria-hidden="true" or any of their parents', () => {
  // > if it, or any of its ancestors [...] have their aria-hidden attribute value set to true.
  // -- https://www.w3.org/TR/wai-aria/#aria-hidden
  // > In other words, aria-hidden="true" on a parent overrides aria-hidden="false" on descendants.
  // -- https://www.w3.org/TR/core-aam-1.1/#exclude_elements2
  const {getByRole} = render(
    '<div aria-hidden="true"><ul aria-hidden="false" /></div>',
  )

  expect(() => getByRole('list')).toThrowErrorMatchingInlineSnapshot(`
"Unable to find an element with the role "list"

Here are the available roles:

  list:

  <ul
    aria-hidden="false"
  />

  --------------------------------------------------

<div>
  <div
    aria-hidden="true"
  >
    <ul
      aria-hidden="false"
    />
  </div>
</div>"
`)
})

test('considers the computed visibility style not the parent', () => {
  // this behavior deviates from the spec which includes "any descendant"
  // if visibility is hidden. However, chrome a11y tree and nvda will include
  // the following markup. This behavior might change depending on how
  // https://github.com/w3c/aria/issues/1055 is resolved.
  const {getByRole} = render(
    '<div style="visibility: hidden;"><ul style="visibility: visible;" /></div>',
  )

  expect(getByRole('list')).not.toBeNull()
})

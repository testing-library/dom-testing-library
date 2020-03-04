import {configure, getConfig} from '../config'
import {getQueriesForElement} from '../get-queries-for-element'
import {render, renderIntoDocument} from './helpers/test-utils'

test('by default logs accessible roles when it fails', () => {
  const {getByRole} = render(`<h1>Hi</h1>`)
  expect(() => getByRole('article')).toThrowErrorMatchingInlineSnapshot(`
"Unable to find an accessible element with the role "article"

Here are the accessible roles:

  heading:

  Name "Hi":
  <h1 />

  --------------------------------------------------

<div>
  <h1>
    Hi
  </h1>
</div>"
`)
})

test('when hidden: true logs available roles when it fails', () => {
  const {getByRole} = render(`<div hidden><h1>Hi</h1></div>`)
  expect(() => getByRole('article', {hidden: true}))
    .toThrowErrorMatchingInlineSnapshot(`
"Unable to find an element with the role "article"

Here are the available roles:

  heading:

  Name "Hi":
  <h1 />

  --------------------------------------------------

<div>
  <div
    hidden=""
  >
    <h1>
      Hi
    </h1>
  </div>
</div>"
`)
})

test('logs error when there are no accessible roles', () => {
  const {getByRole} = render('<div />')
  expect(() => getByRole('article')).toThrowErrorMatchingInlineSnapshot(`
"Unable to find an accessible element with the role "article"

There are no accessible roles. But there might be some inaccessible roles. If you wish to access them, then set the \`hidden\` option to \`true\`. Learn more about this here: https://testing-library.com/docs/dom-testing-library/api-queries#byrole

<div>
  <div />
</div>"
`)
})

test('logs a different error if inaccessible roles should be included', () => {
  const {getByRole} = render('<div />')
  expect(() => getByRole('article', {hidden: true}))
    .toThrowErrorMatchingInlineSnapshot(`
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
"Unable to find an accessible element with the role "list"

There are no accessible roles. But there might be some inaccessible roles. If you wish to access them, then set the \`hidden\` option to \`true\`. Learn more about this here: https://testing-library.com/docs/dom-testing-library/api-queries#byrole

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
"Unable to find an accessible element with the role "list"

There are no accessible roles. But there might be some inaccessible roles. If you wish to access them, then set the \`hidden\` option to \`true\`. Learn more about this here: https://testing-library.com/docs/dom-testing-library/api-queries#byrole

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
  // works in jsdom < 15.2 only when the actual element in question has this
  // css property. only jsdom@^15.2 implements inheritance for `visibility`
  const {getByRole} = render('<div><ul style="visibility: hidden;" /></div>')

  expect(() => getByRole('list')).toThrowErrorMatchingInlineSnapshot(`
"Unable to find an accessible element with the role "list"

There are no accessible roles. But there might be some inaccessible roles. If you wish to access them, then set the \`hidden\` option to \`true\`. Learn more about this here: https://testing-library.com/docs/dom-testing-library/api-queries#byrole

<div>
  <div>
    <ul
      style="visibility: hidden;"
    />
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
"Unable to find an accessible element with the role "list"

There are no accessible roles. But there might be some inaccessible roles. If you wish to access them, then set the \`hidden\` option to \`true\`. Learn more about this here: https://testing-library.com/docs/dom-testing-library/api-queries#byrole

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
    '<div style="visibility: hidden;"><main style="visibility: visible;"><ul /></main></div>',
  )

  expect(getByRole('list')).not.toBeNull()
})

test('can include inaccessible roles', () => {
  // this behavior deviates from the spec which includes "any descendant"
  // if visibility is hidden. However, chrome a11y tree and nvda will include
  // the following markup. This behavior might change depending on how
  // https://github.com/w3c/aria/issues/1055 is resolved.
  const {getByRole} = render('<div hidden><ul  /></div>')

  expect(getByRole('list', {hidden: true})).not.toBeNull()
})

test('can be filtered by accessible name', () => {
  const {getByRole} = renderIntoDocument(
    `
<div>
  <h1>Order</h1>
  <h2>Delivery Adress</h2>
  <form aria-label="Delivery Adress">
    <label>
      <div>Street</div>
      <input type="text" />
    </label>
    <input type="submit" />
  </form>
  <h2>Invoice Adress</h2>
  <form aria-label="Invoice Adress">
    <label>
      <div>Street</div>
      <input type="text" />
    </label>
    <input type="submit" />
  </form>
</div>`,
  )

  const deliveryForm = getByRole('form', {name: 'Delivery Adress'})
  expect(deliveryForm).not.toBeNull()

  expect(
    // TODO: upstream bug in `aria-query`; should be `button` role
    getQueriesForElement(deliveryForm).getByRole('textbox', {name: 'Submit'}),
  ).not.toBeNull()

  const invoiceForm = getByRole('form', {name: 'Delivery Adress'})
  expect(invoiceForm).not.toBeNull()

  expect(
    getQueriesForElement(invoiceForm).getByRole('textbox', {name: 'Street'}),
  ).not.toBeNull()
})

test('accessible name comparison is case sensitive', () => {
  const {getByRole} = render(`<h1>Sign <em>up</em></h1>`)

  // actual:  "Sign up",
  // queried: "Sign Up"
  expect(() => getByRole('heading', {name: 'Sign Up'}))
    .toThrowErrorMatchingInlineSnapshot(`
"Unable to find an accessible element with the role "heading" and name "Sign Up"

Here are the accessible roles:

  heading:

  Name "Sign up":
  <h1 />

  --------------------------------------------------

<div>
  <h1>
    Sign 
    <em>
      up
    </em>
  </h1>
</div>"
`)
})

test('accessible name filter implements TextMatch', () => {
  const {getByRole} = render(
    `<h1>Sign <em>up</em></h1><h2>Details</h2><h2>Your Signature</h2>`,
  )

  // subset via regex
  expect(getByRole('heading', {name: /gn u/})).not.toBeNull()
  // regex
  expect(getByRole('heading', {name: /^sign/i})).not.toBeNull()
  // function
  expect(
    getByRole('heading', {
      name: (name, element) => {
        return element.nodeName === 'H2' && name === 'Your Signature'
      },
    }),
  ).not.toBeNull()
})

test('TextMatch serialization in error message', () => {
  const {getByRole} = render(`<h1>Sign <em>up</em></h1>`)

  expect(() => getByRole('heading', {name: /Login/}))
    .toThrowErrorMatchingInlineSnapshot(`
"Unable to find an accessible element with the role "heading" and name \`/Login/\`

Here are the accessible roles:

  heading:

  Name "Sign up":
  <h1 />

  --------------------------------------------------

<div>
  <h1>
    Sign 
    <em>
      up
    </em>
  </h1>
</div>"
`)

  expect(() => getByRole('heading', {name: () => false}))
    .toThrowErrorMatchingInlineSnapshot(`
"Unable to find an accessible element with the role "heading" and name \`() => false\`

Here are the accessible roles:

  heading:

  Name "Sign up":
  <h1 />

  --------------------------------------------------

<div>
  <h1>
    Sign 
    <em>
      up
    </em>
  </h1>
</div>"
`)
})

describe('configuration', () => {
  let originalConfig
  beforeEach(() => {
    originalConfig = getConfig()
  })

  afterEach(() => {
    configure(originalConfig)
  })

  test('the default value for `hidden` can be configured', () => {
    configure({defaultHidden: true})

    const {getByRole} = render('<div hidden><ul  /></div>')
    expect(getByRole('list')).not.toBeNull()
  })
})

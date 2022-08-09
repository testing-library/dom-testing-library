import {configure, getConfig} from '../config'
import {getQueriesForElement} from '../get-queries-for-element'
import {render, renderIntoDocument} from './helpers/test-utils'

test('by default logs accessible roles when it fails', () => {
  const {getByRole} = render(`<h1>Hi</h1>`)
  expect(() => getByRole('article')).toThrowErrorMatchingInlineSnapshot(`
    Unable to find an accessible element with the role "article"

    Here are the accessible roles:

      heading:

      Name "Hi":
      <h1 />

      --------------------------------------------------

    Ignored nodes: comments, script, style
    <div>
      <h1>
        Hi
      </h1>
    </div>
  `)
})

test('when hidden: true logs available roles when it fails', () => {
  const {getByRole} = render(`<div hidden><h1>Hi</h1></div>`)
  expect(() => getByRole('article', {hidden: true}))
    .toThrowErrorMatchingInlineSnapshot(`
    Unable to find an element with the role "article"

    Here are the available roles:

      heading:

      Name "Hi":
      <h1 />

      --------------------------------------------------

    Ignored nodes: comments, script, style
    <div>
      <div
        hidden=""
      >
        <h1>
          Hi
        </h1>
      </div>
    </div>
  `)
})

test('logs error when there are no accessible roles', () => {
  const {getByRole} = render('<div />')
  expect(() => getByRole('article')).toThrowErrorMatchingInlineSnapshot(`
    Unable to find an accessible element with the role "article"

    There are no accessible roles. But there might be some inaccessible roles. If you wish to access them, then set the \`hidden\` option to \`true\`. Learn more about this here: https://testing-library.com/docs/dom-testing-library/api-queries#byrole

    Ignored nodes: comments, script, style
    <div>
      <div />
    </div>
  `)
})

test('logs a different error if inaccessible roles should be included', () => {
  const {getByRole} = render('<div />')
  expect(() => getByRole('article', {hidden: true}))
    .toThrowErrorMatchingInlineSnapshot(`
    Unable to find an element with the role "article"

    There are no available roles.

    Ignored nodes: comments, script, style
    <div>
      <div />
    </div>
  `)
})

test('by default excludes elements that have the html hidden attribute or any of their parents', () => {
  const {getByRole} = render('<div hidden><ul /></div>')

  expect(() => getByRole('list')).toThrowErrorMatchingInlineSnapshot(`
    Unable to find an accessible element with the role "list"

    There are no accessible roles. But there might be some inaccessible roles. If you wish to access them, then set the \`hidden\` option to \`true\`. Learn more about this here: https://testing-library.com/docs/dom-testing-library/api-queries#byrole

    Ignored nodes: comments, script, style
    <div>
      <div
        hidden=""
      >
        <ul />
      </div>
    </div>
  `)
})

test('by default excludes elements which have display: none or any of their parents', () => {
  const {getByRole} = render(
    '<div style="display: none;"><ul style="display: block;" /></div>',
  )

  expect(() => getByRole('list')).toThrowErrorMatchingInlineSnapshot(`
    Unable to find an accessible element with the role "list"

    There are no accessible roles. But there might be some inaccessible roles. If you wish to access them, then set the \`hidden\` option to \`true\`. Learn more about this here: https://testing-library.com/docs/dom-testing-library/api-queries#byrole

    Ignored nodes: comments, script, style
    <div>
      <div
        style="display: none;"
      >
        <ul
          style="display: block;"
        />
      </div>
    </div>
  `)
})

test('by default excludes elements which have visibility hidden', () => {
  // works in jsdom < 15.2 only when the actual element in question has this
  // css property. only jsdom@^15.2 implements inheritance for `visibility`
  const {getByRole} = render('<div><ul style="visibility: hidden;" /></div>')

  expect(() => getByRole('list')).toThrowErrorMatchingInlineSnapshot(`
    Unable to find an accessible element with the role "list"

    There are no accessible roles. But there might be some inaccessible roles. If you wish to access them, then set the \`hidden\` option to \`true\`. Learn more about this here: https://testing-library.com/docs/dom-testing-library/api-queries#byrole

    Ignored nodes: comments, script, style
    <div>
      <div>
        <ul
          style="visibility: hidden;"
        />
      </div>
    </div>
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
    Unable to find an accessible element with the role "list"

    There are no accessible roles. But there might be some inaccessible roles. If you wish to access them, then set the \`hidden\` option to \`true\`. Learn more about this here: https://testing-library.com/docs/dom-testing-library/api-queries#byrole

    Ignored nodes: comments, script, style
    <div>
      <div
        aria-hidden="true"
      >
        <ul
          aria-hidden="false"
        />
      </div>
    </div>
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
    getQueriesForElement(deliveryForm).getByRole('button', {name: 'Submit'}),
  ).not.toBeNull()

  const invoiceForm = getByRole('form', {name: 'Delivery Adress'})
  expect(invoiceForm).not.toBeNull()

  expect(
    getQueriesForElement(invoiceForm).getByRole('textbox', {name: 'Street'}),
  ).not.toBeNull()
})

test('accessible name comparison is case sensitive', () => {
  const {getByRole} = render(`<h1>Sign <em>up</em></h1>`)

  expect(() => getByRole('heading', {name: 'something that does not match'}))
    .toThrowErrorMatchingInlineSnapshot(`
    Unable to find an accessible element with the role "heading" and name "something that does not match"

    Here are the accessible roles:

      heading:

      Name "Sign up":
      <h1 />

      --------------------------------------------------

    Ignored nodes: comments, script, style
    <div>
      <h1>
        Sign 
        <em>
          up
        </em>
      </h1>
    </div>
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

  expect(() => getByRole('heading', {name: /something that does not match/}))
    .toThrowErrorMatchingInlineSnapshot(`
    Unable to find an accessible element with the role "heading" and name \`/something that does not match/\`

    Here are the accessible roles:

      heading:

      Name "Sign up":
      <h1 />

      --------------------------------------------------

    Ignored nodes: comments, script, style
    <div>
      <h1>
        Sign 
        <em>
          up
        </em>
      </h1>
    </div>
  `)

  expect(() => getByRole('heading', {name: () => false}))
    .toThrowErrorMatchingInlineSnapshot(`
    Unable to find an accessible element with the role "heading" and name \`() => false\`

    Here are the accessible roles:

      heading:

      Name "Sign up":
      <h1 />

      --------------------------------------------------

    Ignored nodes: comments, script, style
    <div>
      <h1>
        Sign 
        <em>
          up
        </em>
      </h1>
    </div>
  `)
})

test('does not include the container in the queryable roles', () => {
  const {getByRole} = render(`<li />`, {
    container: document.createElement('ul'),
  })
  expect(() => getByRole('list')).toThrowErrorMatchingInlineSnapshot(`
    Unable to find an accessible element with the role "list"

    Here are the accessible roles:

      listitem:

      Name "":
      <li />

      --------------------------------------------------

    Ignored nodes: comments, script, style
    <ul>
      <li />
    </ul>
  `)
})

test('has no useful error message in findBy', async () => {
  const {findByRole} = render(`<li />`)

  await expect(findByRole('option', {timeout: 1})).rejects.toThrow(
    'Unable to find role="option"',
  )
})

test('findBy error message for missing elements contains a name hint', async () => {
  const {findByRole} = render(`<button>Click me</button>`)

  await expect(findByRole('button', {name: 'Submit'})).rejects.toThrow(
    'Unable to find role="button" and name "Submit"',
  )
})

test('explicit role is most specific', () => {
  const {getByRole} = renderIntoDocument(
    `<button role="tab" aria-label="my-tab" />`,
  )

  expect(() => getByRole('button')).toThrowErrorMatchingInlineSnapshot(`
    Unable to find an accessible element with the role "button"

    Here are the accessible roles:

      tab:

      Name "my-tab":
      <button
        aria-label="my-tab"
        role="tab"
      />

      --------------------------------------------------

    Ignored nodes: comments, script, style
    <body>
      <button
        aria-label="my-tab"
        role="tab"
      />
    </body>
  `)
})

test('accessible regex name in error message for multiple found', () => {
  const {getByRole} = render(
    `<button>Increment value</button
      ><button>Decrement value</button
      ><button>Reset value</button
    >`,
  )

  expect(() => getByRole('button', {name: /value/i}))
    .toThrowErrorMatchingInlineSnapshot(`
    Found multiple elements with the role "button" and name \`/value/i\`

    Here are the matching elements:

    Ignored nodes: comments, script, style
    <button>
      Increment value
    </button>

    Ignored nodes: comments, script, style
    <button>
      Decrement value
    </button>

    Ignored nodes: comments, script, style
    <button>
      Reset value
    </button>

    (If this is intentional, then use the \`*AllBy*\` variant of the query (like \`queryAllByText\`, \`getAllByText\`, or \`findAllByText\`)).

    Ignored nodes: comments, script, style
    <div>
      <button>
        Increment value
      </button>
      <button>
        Decrement value
      </button>
      <button>
        Reset value
      </button>
    </div>
  `)
})

test('accessible string name in error message for multiple found', () => {
  const {getByRole} = render(
    `<button>Submit</button
      ><button>Submit</button
      ><button>Submit</button
    >`,
  )

  expect(() => getByRole('button', {name: 'Submit'}))
    .toThrowErrorMatchingInlineSnapshot(`
    Found multiple elements with the role "button" and name "Submit"

    Here are the matching elements:

    Ignored nodes: comments, script, style
    <button>
      Submit
    </button>

    Ignored nodes: comments, script, style
    <button>
      Submit
    </button>

    Ignored nodes: comments, script, style
    <button>
      Submit
    </button>

    (If this is intentional, then use the \`*AllBy*\` variant of the query (like \`queryAllByText\`, \`getAllByText\`, or \`findAllByText\`)).

    Ignored nodes: comments, script, style
    <div>
      <button>
        Submit
      </button>
      <button>
        Submit
      </button>
      <button>
        Submit
      </button>
    </div>
  `)
})

test('matching elements in error for multiple found', () => {
  const {getByRole} = render(
    `<button>Increment value</button
      ><button>Different label</button
      ><p>Wrong role</p
      ><button>Reset value</button
    >`,
  )

  expect(() => getByRole('button', {name: /value/i}))
    .toThrowErrorMatchingInlineSnapshot(`
    Found multiple elements with the role "button" and name \`/value/i\`

    Here are the matching elements:

    Ignored nodes: comments, script, style
    <button>
      Increment value
    </button>

    Ignored nodes: comments, script, style
    <button>
      Reset value
    </button>

    (If this is intentional, then use the \`*AllBy*\` variant of the query (like \`queryAllByText\`, \`getAllByText\`, or \`findAllByText\`)).

    Ignored nodes: comments, script, style
    <div>
      <button>
        Increment value
      </button>
      <button>
        Different label
      </button>
      <p>
        Wrong role
      </p>
      <button>
        Reset value
      </button>
    </div>
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

  test('can be configured to consider ::before and ::after for accessible names which logs errors in jsdom', () => {
    try {
      jest.spyOn(console, 'error').mockImplementation(() => {})
      configure({computedStyleSupportsPseudoElements: true})
      const {queryByRole} = render('<button>Hello, Dave!</button>')

      queryByRole('button', {name: 'Hello, Dave!'})

      expect(console.error).toHaveBeenCalledTimes(2)
      expect(console.error.mock.calls[0][0]).toMatch(
        'Error: Not implemented: window.computedStyle(elt, pseudoElt)',
      )
      expect(console.error.mock.calls[1][0]).toMatch(
        'Error: Not implemented: window.computedStyle(elt, pseudoElt)',
      )
    } finally {
      jest.restoreAllMocks()
    }
  })
})

test('should find the input using type property instead of attribute', () => {
  const {getByRole} = render('<input type="124">')
  expect(getByRole('textbox')).not.toBeNull()
})

test('can be filtered by accessible description', () => {
  const targetedNotificationMessage = 'Your session is about to expire!'
  const {getByRole} = renderIntoDocument(
    `
<ul>
  <li role="alertdialog" aria-describedby="notification-id-1">
    <div><button>Close</button></div>
    <div id="notification-id-1">You have unread emails</div>
  </li>
  <li role="alertdialog" aria-describedby="notification-id-2">
    <div><button>Close</button></div>
    <div id="notification-id-2">${targetedNotificationMessage}</div>
  </li>
</ul>`,
  )

  const notification = getByRole('alertdialog', {
    description: targetedNotificationMessage,
  })

  expect(notification).not.toBeNull()
  expect(notification).toHaveTextContent(targetedNotificationMessage)

  expect(
    getQueriesForElement(notification).getByRole('button', {name: 'Close'}),
  ).not.toBeNull()
})

test('error should include description when filtering and no results are found', () => {
  const targetedNotificationMessage = 'Your session is about to expire!'
  const {getByRole} = renderIntoDocument(
    `<div role="dialog" aria-describedby="some-id"><div><button>Close</button></div><div id="some-id">${targetedNotificationMessage}</div></div>`,
  )

  expect(() =>
    getByRole('alertdialog', {description: targetedNotificationMessage}),
  ).toThrowErrorMatchingInlineSnapshot(`
    Unable to find an accessible element with the role "alertdialog" and description "Your session is about to expire!"

    Here are the accessible roles:

      dialog:

      Name "":
      Description "Your session is about to expire!":
      <div
        aria-describedby="some-id"
        role="dialog"
      />

      --------------------------------------------------
      button:

      Name "Close":
      Description "":
      <button />

      --------------------------------------------------

    Ignored nodes: comments, script, style
    <body>
      <div
        aria-describedby="some-id"
        role="dialog"
      >
        <div>
          <button>
            Close
          </button>
        </div>
        <div
          id="some-id"
        >
          Your session is about to expire!
        </div>
      </div>
    </body>
  `)
})

test('TextMatch serialization for description filter in error message', () => {
  const {getByRole} = renderIntoDocument(
    `<div role="alertdialog" aria-describedby="some-id"><div><button>Close</button></div><div id="some-id">Your session is about to expire!</div></div>`,
  )

  expect(() => getByRole('alertdialog', {description: /unknown description/}))
    .toThrowErrorMatchingInlineSnapshot(`
    Unable to find an accessible element with the role "alertdialog" and description \`/unknown description/\`

    Here are the accessible roles:

      alertdialog:

      Name "":
      Description "Your session is about to expire!":
      <div
        aria-describedby="some-id"
        role="alertdialog"
      />

      --------------------------------------------------
      button:

      Name "Close":
      Description "":
      <button />

      --------------------------------------------------

    Ignored nodes: comments, script, style
    <body>
      <div
        aria-describedby="some-id"
        role="alertdialog"
      >
        <div>
          <button>
            Close
          </button>
        </div>
        <div
          id="some-id"
        >
          Your session is about to expire!
        </div>
      </div>
    </body>
  `)

  expect(() => getByRole('alertdialog', {description: () => false}))
    .toThrowErrorMatchingInlineSnapshot(`
    Unable to find an accessible element with the role "alertdialog" and description \`() => false\`

    Here are the accessible roles:

      alertdialog:

      Name "":
      Description "Your session is about to expire!":
      <div
        aria-describedby="some-id"
        role="alertdialog"
      />

      --------------------------------------------------
      button:

      Name "Close":
      Description "":
      <button />

      --------------------------------------------------

    Ignored nodes: comments, script, style
    <body>
      <div
        aria-describedby="some-id"
        role="alertdialog"
      >
        <div>
          <button>
            Close
          </button>
        </div>
        <div
          id="some-id"
        >
          Your session is about to expire!
        </div>
      </div>
    </body>
  `)
})

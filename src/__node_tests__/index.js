import {JSDOM} from 'jsdom'
import {configure} from '../config'
import * as dtl from '../'

beforeEach(() => {
  // reset back to original config
  configure({
    queryAllElements: (element, query) => element.querySelectorAll(query),
  })
})

test('works without a global dom', async () => {
  const container = new JSDOM(`
    <html>
      <body>
        <form id="login-form">
          <label for="username">Username</label>
          <input id="username" />
          <label for="password">Password</label>
          <input id="password" type="password" />
          <button type="submit">Submit</button>
          <div id="data-container"></div>
        </form>
      </body>
    </html>
  `).window.document.body
  container.querySelector('#login-form').addEventListener('submit', e => {
    e.preventDefault()
    const {username, password} = e.target.elements
    setTimeout(() => {
      const dataContainer = container.querySelector('#data-container')
      const pre = container.ownerDocument.createElement('pre')
      pre.dataset.testid = 'submitted-data'
      pre.textContent = JSON.stringify({
        username: username.value,
        password: password.value,
      })
      dataContainer.appendChild(pre)
    }, 20)
  })

  const fakeUser = {username: 'chucknorris', password: 'i need no password'}
  const usernameField = dtl.getByLabelText(container, /username/i)
  const passwordField = dtl.getByLabelText(container, /password/i)
  usernameField.value = fakeUser.username
  passwordField.value = fakeUser.password
  const submitButton = dtl.getByText(container, /submit/i)
  dtl.fireEvent.click(submitButton)
  const submittedDataPre = await dtl.findByTestId(
    container,
    'submitted-data',
    {},
    {container},
  )
  const data = JSON.parse(submittedDataPre.textContent)
  expect(data).toEqual(fakeUser)
})

test('works without a browser context on a dom node (JSDOM Fragment)', () => {
  const container = JSDOM.fragment(`
    <html>
      <body>
        <form id="login-form">
          <label for="username">Username</label>
          <input id="username" />
          <label for="password">Password</label>
          <input id="password" type="password" />
          <button type="submit">Submit</button>
          <div id="data-container"></div>
        </form>
      </body>
    </html>
  `)

  expect(dtl.getByLabelText(container, /username/i)).toMatchInlineSnapshot(`
    <input
      id=username
    />
  `)
  expect(dtl.getByLabelText(container, /password/i)).toMatchInlineSnapshot(`
    <input
      id=password
      type=password
    />
  `)
})

test('works with a custom configured element query for shadow dom elements', async () => {
  const window = new JSDOM(`
    <html>
      <body>
        <example-input></example-input>
      </body>
    </html>
  `).window
  const document = window.document
  const container = document.body

  // create custom element as system under test
  window.customElements.define(
    'example-input',
    class extends window.HTMLElement {
      constructor() {
        super()
        const shadow = this.attachShadow({mode: 'open'})

        const div = document.createElement('div')
        const label = document.createElement('label')
        label.setAttribute('for', 'invisible-from-outer-dom')
        label.innerHTML =
          'Visible in browser, invisible for traditional queries'
        const input = document.createElement('input')
        input.setAttribute('id', 'invisible-from-outer-dom')
        div.appendChild(label)
        div.appendChild(input)
        shadow.appendChild(div)
      }
    },
  )

  // Given the default configuration is used

  // When querying for the label
  // Then it is not in the document
  expect(
    dtl.queryByLabelText(
      container,
      /Visible in browser, invisible for traditional queries/i,
    ),
  ).not.toBeInTheDocument()

  // Given I have a naive query that allows searching shadow dom
  const queryMeAndChildrenAndShadow = (element, query) => [
    ...element.querySelectorAll(`:scope > ${query}`),
    ...[...element.children].reduce(
      (result, child) => [
        ...result,
        ...queryMeAndChildrenAndShadow(child, query),
      ],
      [],
    ),
    ...(element.shadowRoot?.querySelectorAll(query) ?? []),
  ]

  // When I configure the testing tools to use it
  configure({
    queryAllElements: queryMeAndChildrenAndShadow,
  })

  // Then it is part of the document
  expect(
    dtl.queryByLabelText(
      container,
      /Visible in browser, invisible for traditional queries/i,
    ),
  ).toBeInTheDocument()

  // And it returns the expected item
  expect(
    dtl.getByLabelText(
      container,
      /Visible in browser, invisible for traditional queries/i,
    ),
  ).toMatchInlineSnapshot(`
    <input
      id=invisible-from-outer-dom
    />
  `)
})

test('fails with a cross-boundary request for an element query for shadow dom elements with an appropriate error message', async () => {
  const window = new JSDOM(`
    <html>
      <body>
        <example-input></example-input>
      </body>
    </html>
  `).window
  const document = window.document
  const container = document.body

  window.customElements.define(
    'example-input',
    class extends window.HTMLElement {
      constructor() {
        super()
        const shadow = this.attachShadow({mode: 'open'})

        const div = document.createElement('div')
        const label = document.createElement('label')
        label.setAttribute('for', 'invisible-from-outer-dom')
        label.innerHTML =
          'Visible in browser, invisible for traditional queries'
        const input = document.createElement('nested-example-input')
        label.appendChild(input)
        div.appendChild(label)
        shadow.appendChild(div)
      }
    },
  )

  window.customElements.define(
    'nested-example-input',
    class extends window.HTMLElement {
      static formAssociated = true
      constructor() {
        super()
        const shadow = this.attachShadow({mode: 'open'})

        const form = document.createElement('form')
        const input = document.createElement('input')
        input.setAttribute('id', 'invisible-from-outer-dom')
        input.setAttribute('type', 'text')
        form.appendChild(input)
        shadow.appendChild(form)
      }
    },
  )

  // Given I have a naive query that allows searching shadow dom
  const queryDeep = (element, query) =>
    [
      ...element.querySelectorAll(`:scope > ${query}`),
      ...(element.shadowRoot ? queryDeep(element.shadowRoot, query) : []),
      ...[...element.children].reduce(
        (result, child) => [...result, ...queryDeep(child, query)],
        [],
      ),
    ].filter(item => !!item)
  const queryAll = (element, query) => [
    ...element.querySelectorAll(query),
    ...queryDeep(element, query),
  ]
  const queryMeAndChildrenAndShadow = (_, query) =>
    queryAll(document, query).find(element => !!element)
  const queryMeAndChildrenAndShadowAll = (_, query) => [
    ...queryAll(document, query),
  ]

  // When I configure the testing tools to use it
  configure({
    queryElement: queryMeAndChildrenAndShadow,
    queryAllElements: queryMeAndChildrenAndShadowAll,
  })

  // Then it should throw an error informing me that the input is currently non-labelable
  //  While the error message is not correct, the scenario is currently mostly relevant when
  //  extending the query mechanism with shadow dom, so it's not something that the framework
  //  can foresee at the moment. https://github.com/WICG/webcomponents/issues/917 will hopefully
  //  resolve this issue
  expect(() =>
    dtl.getAllByLabelText(
      container,
      /Visible in browser, invisible for traditional queries/i,
    ),
  ).toThrowErrorMatchingInlineSnapshot(`
  Found a label with the text of: /Visible in browser, invisible for traditional queries/i, however the element associated with this label (<input />) is non-labellable [https://html.spec.whatwg.org/multipage/forms.html#category-label]. If you really need to label a <input />, you can use aria-label or aria-labelledby instead.
  
  Ignored nodes: comments, <script />, <style />
  <body>
    
          
    Object {
      Symbol(SameObject caches): Object {
        "children": HTMLCollection [],
      },
    }
    
        
      
    
  </body>
  `)
})

test('byRole works without a global DOM', () => {
  const {
    window: {
      document: {body: container},
    },
  } = new JSDOM(`
    <html>
      <body>
        <button>Say "Hello, Dave!"</button>
      </body>
    </html>
  `)

  expect(dtl.getByRole(container, 'button')).toMatchInlineSnapshot(`
    <button>
      Say "Hello, Dave!"
    </button>
  `)
})

test('findBy works without a global DOM', async () => {
  const {window} = new JSDOM(`<div>
    <div data-testid="test-id" aria-label="test-label">test text content</div>
    <select><option>display value</option></select>
    <input placeholder="placeholder" />
    <img alt="test alt text" src="/lucy-ricardo.png" />
    <span title="test title" />
    <div role="dialog"></div>
    <div role="meter progressbar"></div>
    <header>header</header>
    <input type="hidden" />
  </div>`)

  await expect(
    dtl.findByLabelText(window.document, 'test-label'),
  ).resolves.toBeTruthy()
  await expect(
    dtl.findAllByLabelText(window.document, 'test-label'),
  ).resolves.toHaveLength(1)
  await expect(
    dtl.findByPlaceholderText(window.document, 'placeholder'),
  ).resolves.toBeTruthy()
  await expect(
    dtl.findAllByPlaceholderText(window.document, 'placeholder'),
  ).resolves.toHaveLength(1)
  await expect(
    dtl.findByText(window.document, 'test text content'),
  ).resolves.toBeTruthy()
  await expect(
    dtl.findAllByText(window.document, 'test text content'),
  ).resolves.toHaveLength(1)
  await expect(
    dtl.findByAltText(window.document, 'test alt text'),
  ).resolves.toBeTruthy()
  await expect(
    dtl.findAllByAltText(window.document, 'test alt text'),
  ).resolves.toHaveLength(1)
  await expect(
    dtl.findByTitle(window.document, 'test title'),
  ).resolves.toBeTruthy()
  await expect(
    dtl.findAllByTitle(window.document, 'test title'),
  ).resolves.toHaveLength(1)
  await expect(
    dtl.findByDisplayValue(window.document, 'display value'),
  ).resolves.toBeTruthy()
  await expect(
    dtl.findAllByDisplayValue(window.document, 'display value'),
  ).resolves.toHaveLength(1)
  await expect(dtl.findByRole(window.document, 'dialog')).resolves.toBeTruthy()
  await expect(
    dtl.findAllByRole(window.document, 'dialog'),
  ).resolves.toHaveLength(1)
  await expect(dtl.findByRole(window.document, 'meter')).resolves.toBeTruthy()
  await expect(
    dtl.findAllByRole(window.document, 'meter'),
  ).resolves.toHaveLength(1)
  await expect(
    dtl.findByRole(window.document, 'progressbar', {queryFallbacks: true}),
  ).resolves.toBeTruthy()
  await expect(
    dtl.findAllByRole(window.document, 'progressbar', {queryFallbacks: true}),
  ).resolves.toHaveLength(1)
  await expect(dtl.findByRole(window.document, 'banner')).resolves.toBeTruthy()
  await expect(
    dtl.findAllByRole(window.document, 'banner'),
  ).resolves.toHaveLength(1)
  await expect(
    dtl.findByTestId(window.document, 'test-id'),
  ).resolves.toBeTruthy()
  await expect(
    dtl.findAllByTestId(window.document, 'test-id'),
  ).resolves.toHaveLength(1)
})

import {JSDOM} from 'jsdom'
import * as dtl from '../'

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

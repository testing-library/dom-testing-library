import {
  fireEvent,
  isInaccessible,
  queries,
  buildQueries,
  queryAllByAttribute,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  MatcherOptions,
} from '@testing-library/dom'

const {
  getByText,
  queryByText,
  findByText,
  getAllByText,
  queryAllByText,
  findAllByText,
  queryAllByRole,
  queryByRole,
  findByRole,
} = queries

async function testQueries() {
  // element queries
  const element = document.createElement('div')
  getByText(element, 'foo')
  queryByText(element, 'foo')
  await findByText(element, 'foo')
  await findByText(element, 'foo', undefined, {timeout: 10})
  getAllByText(element, 'bar')
  queryAllByText(element, 'bar')
  await findAllByText(element, 'bar')
  await findAllByText(element, 'bar', undefined, {timeout: 10})

  // screen queries
  screen.getByText('foo')
  screen.queryByText('foo')
  await screen.findByText('foo')
  await screen.findByText('foo', undefined, {timeout: 10})
  screen.debug(screen.getAllByText('bar'))
  screen.queryAllByText('bar')
  await screen.findAllByText('bar')
  await screen.findAllByText('bar', undefined, {timeout: 10})
}

async function testQueryHelpers() {
  const element = document.createElement('div')
  const includesAutomationId = (content: string, automationId: string) =>
    content.split(/\s+/).some(id => id === automationId)
  const queryAllByAutomationId = (
    container: HTMLElement,
    automationId: string | string[],
    options?: MatcherOptions,
  ) =>
    queryAllByAttribute(
      'testId',
      container,
      content =>
        Array.isArray(automationId)
          ? automationId.every(id => includesAutomationId(content, id))
          : includesAutomationId(content, automationId),
      options,
    )
  const [
    queryByAutomationId,
    getAllByAutomationId,
    getByAutomationId,
    findAllByAutomationId,
    findByAutomationId,
  ] = buildQueries(
    queryAllByAutomationId,
    () => 'Multiple Error',
    () => 'Missing Error',
  )
  queryByAutomationId(element, 'id')
  getAllByAutomationId(element, 'id')
  getByAutomationId(element, ['id', 'automationId'])
  findAllByAutomationId(element, 'id', {}, {timeout: 1000})
  findByAutomationId(element, 'id', {}, {timeout: 1000})
}

async function testByRole() {
  const element = document.createElement('button')
  element.setAttribute('aria-hidden', 'true')

  console.assert(queryByRole(element, 'button') === null)
  console.assert(queryByRole(element, 'button', {hidden: true}) !== null)

  console.assert(screen.queryByRole('button') === null)
  console.assert(screen.queryByRole('button', {hidden: true}) !== null)

  console.assert(
    (await findByRole(element, 'button', undefined, {timeout: 10})) === null,
  )
  console.assert(
    (await findByRole(element, 'button', {hidden: true}, {timeout: 10})) !==
      null,
  )

  console.assert(
    queryAllByRole(document.body, 'progressbar', {queryFallbacks: true})
      .length === 1,
  )

  // `name` option
  console.assert(queryByRole(element, 'button', {name: 'Logout'}) === null)
  console.assert(queryByRole(element, 'button', {name: /^Log/}) === null)
  console.assert(
    queryByRole(element, 'button', {
      name: (name, element) =>
        name === 'Login' && element.hasAttribute('disabled'),
    }) === null,
  )

  // allow to query for a role that isn't included in the types
  console.assert(queryByRole(element, 'foo') === null)
  console.assert(queryByRole(element, /foo/) === null)
  console.assert(screen.queryByRole('foo') === null)
  console.assert(screen.queryByRole(/foo/) === null)
}

function testA11yHelper() {
  const element = document.createElement('svg')
  console.assert(!isInaccessible(element))
}

function eventTest() {
  fireEvent.popState(window, {
    location: 'http://www.example.com/?page=1',
    state: {page: 1},
  })

  // HTMLElement
  const element = document.createElement('div')
  fireEvent.click(getByText(element, 'foo'))

  // ChildNode
  const child = document.createElement('div')
  element.appendChild(child)
  if (!element.firstChild) {
    // Narrow Type
    throw new Error(`Can't find firstChild`)
  }
  fireEvent.click(element.firstChild)
}

async function testWaitFors() {
  const element = document.createElement('div')

  await waitFor(() => getByText(element, 'apple'))
  await waitFor(() => getAllByText(element, 'apple'))
  const result: HTMLSpanElement = await waitFor(() =>
    getByText(element, 'apple'),
  )
  if (!result) {
    // Use value
    throw new Error(`Can't find result`)
  }

  element.innerHTML = '<span>apple</span>'

  await waitForElementToBeRemoved(() => getByText(element, 'apple'), {
    interval: 3000,
    container: element,
    timeout: 5000,
  })
  await waitForElementToBeRemoved(getByText(element, 'apple'))
  await waitForElementToBeRemoved(getAllByText(element, 'apple'))

  // $ExpectError
  await waitFor(async () => {})
}

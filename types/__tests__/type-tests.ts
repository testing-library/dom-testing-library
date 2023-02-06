import {
  createEvent,
  fireEvent,
  isInaccessible,
  queries,
  buildQueries,
  queryAllByAttribute,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  MatcherOptions,
  BoundFunctions,
  within,
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

export async function testQueries() {
  // element queries
  const element = document.createElement('div')
  getByText(element, 'foo')
  getByText(element, 1)
  queryByText(element, 'foo')
  await findByText(element, 'foo')
  await findByText(element, 'foo', undefined, {timeout: 10})
  getAllByText(element, 'bar')
  queryAllByText(element, 'bar')
  await findAllByText(element, 'bar')
  await findAllByText(element, 'bar', undefined, {timeout: 10})

  // screen queries
  screen.getByText('foo')
  screen.getByText<HTMLDivElement>('foo')
  screen.queryByText('foo')
  await screen.findByText('foo')
  await screen.findByText('foo', undefined, {timeout: 10})
  screen.debug(screen.getAllByText('bar'))
  screen.queryAllByText('bar')
  await screen.findAllByText('bar')
  await screen.findAllByRole<HTMLButtonElement>('button', {name: 'submit'})
  await screen.findAllByText('bar', undefined, {timeout: 10})
}

export async function testQueryHelpers() {
  const element = document.createElement('div')
  const includesAutomationId = (content: string, automationId: string) =>
    content.split(/\s+/).some(id => id === automationId)
  const queryAllByAutomationId = (
    container: HTMLElement,
    automationId: string[] | string,
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

  const createIdRelatedErrorHandler =
    (errorMessage: string, defaultErrorMessage: string) =>
    <T>(container: Element | null, ...args: T[]) => {
      const [key, value] = args
      if (!container) {
        return 'Container element not specified'
      }
      if (key && value) {
        return errorMessage
          .replace('[key]', String(key))
          .replace('[value]', String(value))
      }
      return defaultErrorMessage
    }

  const [
    queryByAutomationId,
    getAllByAutomationId,
    getByAutomationId,
    findAllByAutomationId,
    findByAutomationId,
  ] = buildQueries(
    queryAllByAutomationId,
    createIdRelatedErrorHandler(
      `Found multiple with key [key] and value [value]`,
      'Multiple error',
    ),
    createIdRelatedErrorHandler(
      `Unable to find an element with the [key] attribute of: [value]`,
      'Missing error',
    ),
  )
  queryByAutomationId(element, 'id')
  getAllByAutomationId(element, 'id')
  getByAutomationId(element, ['id', 'automationId'])
  await findAllByAutomationId(element, 'id', {}, {timeout: 1000})
  await findByAutomationId(element, 'id', {}, {timeout: 1000})
  // test optional params too
  await findAllByAutomationId(element, 'id', {})
  await findByAutomationId(element, 'id', {})
  await findAllByAutomationId(element, 'id')
  await findByAutomationId(element, 'id')

  await findAllByAutomationId(element, ['id', 'id'], {})
  await findByAutomationId(element, ['id', 'id'], {})
  await findAllByAutomationId(element, ['id', 'id'])
  await findByAutomationId(element, ['id', 'id'])

  const screenWithCustomQueries = within(document.body, {
    ...queries,
    queryByAutomationId,
    getAllByAutomationId,
    getByAutomationId,
    findAllByAutomationId,
    findByAutomationId,
  })

  screenWithCustomQueries.queryByAutomationId('id')
  screenWithCustomQueries.getAllByAutomationId('id')
  screenWithCustomQueries.getByAutomationId(['id', 'automationId'])
  await screenWithCustomQueries.findAllByAutomationId('id', {}, {timeout: 1000})
  await screenWithCustomQueries.findByAutomationId('id', {}, {timeout: 1000})
}

export function testBoundFunctions() {
  const boundfunctions = {} as BoundFunctions<{
    customQueryOne: (container: HTMLElement, text: string) => HTMLElement
    customQueryTwo: (
      container: HTMLElement,
      text: string,
      text2: string,
    ) => HTMLElement
    customQueryThree: (container: HTMLElement, number: number) => HTMLElement
  }>

  boundfunctions.customQueryOne('one')
  boundfunctions.customQueryTwo('one', 'two')
  boundfunctions.customQueryThree(3)
}

export async function testByRole() {
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
      name: (name, el) => name === 'Login' && el.hasAttribute('disabled'),
    }) === null,
  )

  console.assert(queryByRole(element, 'foo') === null)
  console.assert(screen.queryByRole('foo') === null)
}

export function testA11yHelper() {
  const element = document.createElement('svg')
  console.assert(!isInaccessible(element))
}

export function eventTest() {
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

  // Custom event
  const customEvent = createEvent('customEvent', element)
  fireEvent(element, customEvent)
}

export async function testWaitFors() {
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

  await waitFor(async () => {})
}

export async function testWithin() {
  const container = within(document.body)
  container.queryAllByLabelText('Some label')

  container.getByText('Click me')
  container.getByText<HTMLButtonElement>('Click me')
  container.getAllByText<HTMLButtonElement>('Click me')

  await container.findByRole('button', {name: /click me/i})
  container.getByRole<HTMLButtonElement>('button', {name: /click me/i})

  let withinQueries = within(document.body)
  withinQueries = within(document.body)
  withinQueries.getByRole<HTMLButtonElement>('button', {name: /click me/i})
  withinQueries = within(document.body)
  withinQueries.getByRole<HTMLButtonElement>('button', {name: /click me/i})
}

/*
eslint
  @typescript-eslint/no-unnecessary-condition: "off",
  import/no-extraneous-dependencies: "off"
*/

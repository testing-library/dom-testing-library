<div align="center">
<h1>dom-testing-library</h1>

<a href="https://www.emojione.com/emoji/1f419">
<img height="80" width="80" alt="octopus" src="https://raw.githubusercontent.com/kentcdodds/dom-testing-library/master/other/octopus.png" />
</a>

<p>Simple and complete DOM testing utilities that encourage good testing practices.</p>
</div>

<hr />

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![version][version-badge]][package]
[![downloads][downloads-badge]][npmtrends]
[![MIT License][license-badge]][license]

[![All Contributors](https://img.shields.io/badge/all_contributors-41-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs]
[![Code of Conduct][coc-badge]][coc]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

<div align="center">
<a href="https://testingjavascript.com">
<img width="500" alt="TestingJavaScript.com Learn the smart, efficient way to test any JavaScript application." src="https://raw.githubusercontent.com/kentcdodds/dom-testing-library/master/other/testingjavascript.jpg" />
</a>
</div>

## The problem

You want to write maintainable tests for your Web UI. As a part of
this goal, you want your tests to avoid including implementation details of
your components and rather focus on making your tests give you the confidence
for which they are intended. As part of this, you want your testbase to be
maintainable in the long run so refactors of your components (changes to
implementation but not functionality) don't break your tests and slow you and
your team down.

## This solution

The `dom-testing-library` is a very light-weight solution for testing DOM nodes
(whether simulated with [`JSDOM`](https://github.com/jsdom/jsdom) as provided by
default with [jest][] or in the browser). The main utilities it provides involve
querying the DOM for nodes in a way that's similar to how the user finds
elements on the page. In this way, the library helps ensure your tests give you
confidence in your UI code. The `dom-testing-library`'s primary guiding
principle is:

> [The more your tests resemble the way your software is used, the more confidence they can give you.][guiding-principle]

As part of this goal, the utilities this library provides facilitate querying
the DOM in the same way the user would. Finding for elements by their label text
(just like a user would), finding links and buttons from their text
(like a user would), and more. It also exposes a recommended way to find
elements by a `data-testid` as an "escape hatch" for elements where the text
content and label do not make sense or is not practical.

This library encourages your applications to be more accessible and allows you
to get your tests closer to using your components the way a user will, which
allows your tests to give you more confidence that your application will work
when a real user uses it.

**What this library is not**:

1.  A test runner or framework
2.  Specific to a testing framework (though we recommend Jest as our
    preference, the library works with any framework. See [Using Without Jest](#using-without-jest))

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Usage](#usage)
  - [`getByLabelText`](#getbylabeltext)
  - [`getByPlaceholderText`](#getbyplaceholdertext)
  - [`getBySelectText`](#getbyselecttext)
  - [`getByText`](#getbytext)
  - [`getByAltText`](#getbyalttext)
  - [`getByTitle`](#getbytitle)
  - [`getByValue`](#getbyvalue)
  - [`getByRole`](#getbyrole)
  - [`getByTestId`](#getbytestid)
  - [`wait`](#wait)
  - [`waitForElement`](#waitforelement)
  - [`waitForDomChange`](#waitfordomchange)
  - [`fireEvent`](#fireevent)
  - [`getNodeText`](#getnodetext)
- [Custom Jest Matchers](#custom-jest-matchers)
- [Custom Queries](#custom-queries)
  - [Using other assertion libraries](#using-other-assertion-libraries)
- [`TextMatch`](#textmatch)
  - [Precision](#precision)
  - [TextMatch Examples](#textmatch-examples)
- [`query` APIs](#query-apis)
- [`queryAll` and `getAll` APIs](#queryall-and-getall-apis)
- [`within` and `getQueriesForElement` APIs](#within-and-getqueriesforelement-apis)
- [Debugging](#debugging)
  - [`prettyDOM`](#prettydom)
- [Implementations](#implementations)
- [Using Without Jest](#using-without-jest)
- [FAQ](#faq)
- [Other Solutions](#other-solutions)
- [Guiding Principles](#guiding-principles)
- [Contributors](#contributors)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```
npm install --save-dev dom-testing-library
```

## Usage

Note:

- Each of the `get` APIs below have a matching [`getAll`](#queryall-and-getall-apis) API that returns all elements instead of just the first one, and [`query`](#query-apis)/[`queryAll`](#queryall-and-getall-apis) that return `null`/`[]` instead of throwing an error.
- See [TextMatch](#textmatch) for details on the `exact`, `trim`, and `collapseWhitespace` options.

```javascript
// src/__tests__/example.js
// query utilities:
import {
  getByLabelText,
  getByText,
  getByTestId,
  queryByTestId,
  // Tip: all queries are also exposed on an object
  // called "queries" which you could import here as well
  wait,
} from 'dom-testing-library'
// adds special assertions like toHaveTextContent
import 'jest-dom/extend-expect'

function getExampleDOM() {
  // This is just a raw example of setting up some DOM
  // that we can interact with. Swap this with your UI
  // framework of choice 😉
  const div = document.createElement('div')
  div.innerHTML = `
    <label for="username">Username</label>
    <input id="username" />
    <button>Print Username</button>
  `
  const button = div.querySelector('button')
  const input = div.querySelector('input')
  button.addEventListener('click', () => {
    // let's pretend this is making a server request, so it's async
    // (you'd want to mock this imaginary request in your unit tests)...
    setTimeout(() => {
      const printedUsernameContainer = document.createElement('div')
      printedUsernameContainer.innerHTML = `
        <div data-testid="printed-username">${input.value}</div>
      `
      div.appendChild(printedUsernameContainer)
    }, Math.floor(Math.random() * 200))
  })
  return div
}

test('examples of some things', async () => {
  const famousWomanInHistory = 'Ada Lovelace'
  const container = getExampleDOM()

  // Get form elements by their label text.
  // An error will be thrown if one cannot be found (accessibility FTW!)
  const input = getByLabelText(container, 'Username')
  input.value = famousWomanInHistory

  // Get elements by their text, just like a real user does.
  getByText(container, 'Print Username').click()

  await wait(() =>
    expect(queryByTestId(container, 'printed-username')).toBeTruthy(),
  )

  // getByTestId and queryByTestId are an escape hatch to get elements
  // by a test id (could also attempt to get this element by it's text)
  expect(getByTestId(container, 'printed-username')).toHaveTextContent(
    famousWomanInHistory,
  )
  // jest snapshots work great with regular DOM nodes!
  expect(container).toMatchSnapshot()
})
```

### `getByLabelText`

```typescript
getByLabelText(
  container: HTMLElement,
  text: TextMatch,
  options?: {
    selector?: string = '*',
    exact?: boolean = true,
    collapseWhitespace?: boolean = true,
    trim?: boolean = true,
  }): HTMLElement
```

This will search for the label that matches the given [`TextMatch`](#textmatch),
then find the element associated with that label.

```javascript
const inputNode = getByLabelText(container, 'Username')

// this would find the input node for the following DOM structures:
// The "for" attribute (NOTE: in JSX with React you'll write "htmlFor" rather than "for")
// <label for="username-input">Username</label>
// <input id="username-input" />
//
// The aria-labelledby attribute with form elements
// <label id="username-label">Username</label>
// <input aria-labelledby="username-label" />
//
// The aria-labelledby attribute with other elements
// <section aria-labelledby="section-one-header">
//   <h3 id="section-one-header">Section One</h3>
//   <p>some content...</p>
// <section>
//
// Wrapper labels
// <label>Username <input /></label>
//
// It will NOT find the input node for this:
// <label><span>Username</span> <input /></label>
//
// For this case, you can provide a `selector` in the options:
const inputNode = getByLabelText(container, 'username', {selector: 'input'})
// and that would work
// Note that <input aria-label="username" /> will also work, but take
// care because this is not a label that users can see on the page. So
// the purpose of your input should be obvious for those users.
```

> Note: This method will throw an error if it cannot find the node. If you don't
> want this behavior (for example you wish to assert that it doesn't exist),
> then use `queryByLabelText` instead.

### `getByPlaceholderText`

```typescript
getByPlaceholderText(
  container: HTMLElement,
  text: TextMatch,
  options?: {
    exact?: boolean = true,
    collapseWhitespace?: boolean = false,
    trim?: boolean = true,
  }): HTMLElement
```

This will search for all elements with a placeholder attribute and find one
that matches the given [`TextMatch`](#textmatch).

```javascript
// <input placeholder="Username" />
const inputNode = getByPlaceholderText(container, 'Username')
```

> NOTE: a placeholder is not a good substitute for a label so you should
> generally use `getByLabelText` instead.

### `getBySelectText`

```typescript
getBySelectText(
  container: HTMLElement,
  text: TextMatch,
  options?: {
    exact?: boolean = true,
    collapseWhitespace?: boolean = true,
    trim?: boolean = true,
  }): HTMLElement
```

This will search for a `<select>` whose selected `<option>` matches the given [`TextMatch`](#textmatch). This would find the `<select>` node in a situation
where the first value acts as a sort of placeholder for the dropdown.

```javascript
// <select>
//   <option value="">Day of the Week</option>
//   <option value="1">Monday</option>
//   <option value="2">Tuesday</option>
//   <option value="3">Wednesday</option>
// </select>
const selectNode = getBySelectText(container, 'Day of the Week')
```

> Note: It is highly preferred to use `getByLabelText` over this method. This
> method should only be used in the event where there is no label text available.

### `getByText`

```typescript
getByText(
  container: HTMLElement,
  text: TextMatch,
  options?: {
    selector?: string = '*',
    exact?: boolean = true,
    collapseWhitespace?: boolean = true,
    trim?: boolean = true,
    ignore?: string|boolean = 'script, style'
  }): HTMLElement
```

This will search for all elements that have a text node with `textContent`
matching the given [`TextMatch`](#textmatch).

```javascript
// <a href="/about">About ℹ️</a>
const aboutAnchorNode = getByText(container, /about/i)
```

> NOTE: see [`getByLabelText`](#getbylabeltext) for more details on how and when to use the `selector` option

The `ignore` option accepts a query selector. If the
[`node.matches`](https://developer.mozilla.org/en-US/docs/Web/API/Element/matches)
returns true for that selector, the node will be ignored. This defaults to
`'script'` because generally you don't want to select script tags, but if your
content is in an inline script file, then the script tag could be returned.

If you'd rather disable this behavior, set `ignore` to `false`.

### `getByAltText`

```typescript
getByAltText(
  container: HTMLElement,
  text: TextMatch,
  options?: {
    exact?: boolean = true,
    collapseWhitespace?: boolean = false,
    trim?: boolean = true,
  }): HTMLElement
```

This will return the element (normally an `<img>`) that has the given `alt`
text. Note that it only supports elements which accept an `alt` attribute:
[`<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img),
[`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input),
and [`<area>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/area)
(intentionally excluding [`<applet>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/applet) as it's deprecated).

```javascript
// <img alt="Incredibles 2 Poster" src="/incredibles-2.png" />
const incrediblesPosterImg = getByAltText(container, /incredibles.*poster$/i)
```

### `getByTitle`

```typescript
getByTitle(
  container: HTMLElement,
  title: TextMatch,
  options?: {
    exact?: boolean = true,
    collapseWhitespace?: boolean = false,
    trim?: boolean = true,
  }): HTMLElement
```

Returns the element that has the matching `title` attribute.

```javascript
// <span title="Delete" id="2" />
const deleteElement = getByTitle(container, 'Delete')
```

Will also find a `title` element within an SVG.

```javascript
// <svg> <title>Close</title> <g> <path /> </g> </svg>
const closeElement = getByTitle(container, 'Close')
```

### `getByValue`

```typescript
getByValue(
  container: HTMLElement,
  value: TextMatch,
  options?: {
    exact?: boolean = true,
    collapseWhitespace?: boolean = false,
    trim?: boolean = true,
  }): HTMLElement
```

Returns the element that has the matching value.

```javascript
// <input type="text" id="lastName" defaultValue="Norris" />
const lastNameInput = getByValue('Norris')
```

### `getByRole`

```typescript
getByRole(
  container: HTMLElement,
  text: TextMatch,
  options?: {
    exact?: boolean = true,
    collapseWhitespace?: boolean = false,
    trim?: boolean = true,
  }): HTMLElement
```

A shortcut to `` container.querySelector(`[role="${yourRole}"]`) `` (and it
also accepts a [`TextMatch`](#textmatch)).

```javascript
// <div role="dialog">...</div>
const dialogContainer = getByRole(container, 'dialog')
```

### `getByTestId`

```typescript
getByTestId(
  container: HTMLElement,
  text: TextMatch,
  options?: {
    exact?: boolean = true,
    collapseWhitespace?: boolean = false,
    trim?: boolean = true,
  }): HTMLElement`
```

A shortcut to `` container.querySelector(`[data-testid="${yourId}"]`) `` (and it
also accepts a [`TextMatch`](#textmatch)).

```javascript
// <input data-testid="username-input" />
const usernameInputElement = getByTestId(container, 'username-input')
```

> In the spirit of [the guiding principles](#guiding-principles), it is
> recommended to use this only after the other queries don't work for your use
> case. Using data-testid attributes do not resemble how your software is used
> and should be avoided if possible. That said, they are _way_ better than
> querying based on DOM structure or styling css class names. Learn more about
> `data-testid`s from the blog post
> ["Making your UI tests resilient to change"][data-testid-blog-post]

### `wait`

```typescript
function wait(
  callback?: () => void,
  options?: {
    timeout?: number
    interval?: number
  },
): Promise<void>
```

When in need to wait for non-deterministic periods of time you can use `wait`,
to wait for your expectations to pass. The `wait` function is a small wrapper
around the
[`wait-for-expect`](https://github.com/TheBrainFamily/wait-for-expect) module.
Here's a simple example:

```javascript
// ...
// Wait until the callback does not throw an error. In this case, that means
// it'll wait until we can get a form control with a label that matches "username".
await wait(() => getByLabelText(container, 'username'))
getByLabelText(container, 'username').value = 'chucknorris'
// ...
```

This can be useful if you have a unit test that mocks API calls and you need
to wait for your mock promises to all resolve.

The default `callback` is a no-op function (used like `await wait()`). This can
be helpful if you only need to wait for one tick of the event loop (in the case
of mocked API calls with promises that resolve immediately).

The default `timeout` is `4500ms` which will keep you under
[Jest's default timeout of `5000ms`](https://facebook.github.io/jest/docs/en/jest-object.html#jestsettimeouttimeout).

The default `interval` is `50ms`. However it will run your callback immediately
on the next tick of the event loop (in a `setTimeout`) before starting the
intervals.

### `waitForElement`

```typescript
function waitForElement<T>(
  callback: () => T,
  options?: {
    container?: HTMLElement
    timeout?: number
    mutationObserverOptions?: MutationObserverInit
  },
): Promise<T>
```

When in need to wait for DOM elements to appear, disappear, or change you can use `waitForElement`.
The `waitForElement` function is a small wrapper around the [`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver).

Here's a simple example:

```javascript
// ...
// Wait until the callback does not throw an error and returns a truthy value. In this case, that means
// it'll wait until we can get a form control with a label that matches "username".
// The difference from `wait` is that rather than running your callback on
// an interval, it's run as soon as there are DOM changes in the container
// and returns the value returned by the callback.
const usernameElement = await waitForElement(
  () => getByLabelText(container, 'username'),
  {container},
)
usernameElement.value = 'chucknorris'
// ...
```

You can also wait for multiple elements at once:

```javascript
const [usernameElement, passwordElement] = await waitForElement(
  () => [
    getByLabelText(container, 'username'),
    getByLabelText(container, 'password'),
  ],
  {container},
)
```

Using [`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) is more efficient than polling the DOM at regular intervals with `wait`. This library sets up a [`'mutationobserver-shim'`](https://github.com/megawac/MutationObserver.js) on the global `window` object for cross-platform compatibility with older browsers and the [`jsdom`](https://github.com/jsdom/jsdom/issues/639) that is usually used in Node-based tests.

The default `container` is the global `document`. Make sure the elements you wait for will be attached to it, or set a different `container`.

The default `timeout` is `4500ms` which will keep you under
[Jest's default timeout of `5000ms`](https://facebook.github.io/jest/docs/en/jest-object.html#jestsettimeouttimeout).

<a name="mutationobserveroptions"></a>The default `mutationObserverOptions` is `{subtree: true, childList: true, attributes: true, characterData: true}` which will detect
additions and removals of child elements (including text nodes) in the `container` and any of its descendants. It will also detect attribute changes.

### `waitForDomChange`

```typescript
function waitForDomChange<T>(options?: {
  container?: HTMLElement
  timeout?: number
  mutationObserverOptions?: MutationObserverInit
}): Promise<T>
```

When in need to wait for the DOM to change you can use `waitForDomChange`. The `waitForDomChange`
function is a small wrapper around the
[`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver).

Here is an example where the promise will be resolved because the container is changed:

```javascript
const container = document.createElement('div')
waitForDomChange({container})
  .then(() => console.log('DOM changed!'))
  .catch(err => console.log(`Error you need to deal with: ${err}`))
container.append(document.createElement('p'))
// if 👆 was the only code affecting the container and it was not run,
// waitForDomChange would throw an error
```

The promise will resolve with a [`mutationsList`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/MutationObserver) which you can use to determine what kind of a change (or changes) affected the container

```javascript
const container = document.createElement('div')
container.setAttribute('data-cool', 'true')
waitForDomChange({container}).then(mutationsList => {
  const mutation = mutationsList[0]
  console.log(
    `was cool: ${mutation.oldValue}\ncurrently cool: ${
      mutation.target.dataset.cool
    }`,
  )
})
container.setAttribute('data-cool', 'false')
/*
  logs:
    was cool: true
    currently cool: false
*/
```

Using [`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) is more efficient than polling the DOM at regular intervals with `wait`. This library sets up a [`'mutationobserver-shim'`](https://github.com/megawac/MutationObserver.js) on the global `window` object for cross-platform compatibility with older browsers and the [`jsdom`](https://github.com/jsdom/jsdom/issues/639) that is usually used in Node-based tests.

The default `container` is the global `document`. Make sure the elements you wait for will be attached to it, or set a different `container`.

The default `timeout` is `4500ms` which will keep you under
[Jest's default timeout of `5000ms`](https://facebook.github.io/jest/docs/en/jest-object.html#jestsettimeouttimeout).

<a name="mutationobserveroptions"></a>The default `mutationObserverOptions` is `{subtree: true, childList: true, attributes: true, characterData: true}` which will detect
additions and removals of child elements (including text nodes) in the `container` and any of its descendants. It will also detect attribute changes.

### `fireEvent`

```typescript
fireEvent(node: HTMLElement, event: Event)
```

Fire DOM events.

```javascript
// <button>Submit</button>
fireEvent(
  getByText(container, 'Submit'),
  new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  }),
)
```

#### `fireEvent[eventName]`

```typescript
fireEvent[eventName](node: HTMLElement, eventProperties: Object)
```

Convenience methods for firing DOM events. Check out
[src/events.js](https://github.com/kentcdodds/dom-testing-library/blob/master/src/events.js)
for a full list as well as default `eventProperties`.

```javascript
// <button>Submit</button>
const rightClick = {button: 2}
fireEvent.click(getByText('Submit'), rightClick)
// default `button` property for click events is set to `0` which is a left click.
```

**target**: When an event is dispatched on an element, the event has the
subjected element on a property called `target`. As a convenience, if you
provide a `target` property in the `eventProperties` (second argument), then
those properties will be assigned to the node which is receiving the event.

This is particularly useful for a change event:

```javascript
fireEvent.change(getByLabelText(/username/i), {target: {value: 'a'}})

// note: attempting to manually set the files property of an HTMLInputElement
// results in an error as the files property is read-only.
// this feature works around that by using Object.defineProperty.
fireEvent.change(getByLabelText(/picture/i), {
  target: {
    files: [new File(['(⌐□_□)'], 'chucknorris.png', {type: 'image/png'})],
  },
})
```

### `getNodeText`

```typescript
getNodeText(node: HTMLElement)
```

Returns the complete text content of a html element, removing any extra
whitespace. The intention is to treat text in nodes exactly as how it is
perceived by users in a browser, where any extra whitespace within words in the
html code is not meaningful when the text is rendered.

```javascript
// <div>
//   Hello
//     World  !
// </div>
const text = getNodeText(container.querySelector('div')) // "Hello World !"
```

This function is also used internally when querying nodes by their text content.
This enables functions like `getByText` and `queryByText` to work as expected,
finding elements in the DOM similarly to how users would do.

## Custom Jest Matchers

When using [jest][], it is convenient to import a set of custom matchers that
make it easier to check several aspects of the state of a DOM element. For
example, you can use the ones provided by
[jest-dom](https://github.com/gnapse/jest-dom):

```javascript
import 'jest-dom/extend-expect'

// <span data-testid="greetings">Hello World</span>
expect(queryByTestId(container, 'greetings')).not.toHaveTextContent('Bye bye')
// ...
```

> Note: when using some of these matchers, you may need to make sure
> you use a query function (like `queryByTestId`) rather than a get
> function (like `getByTestId`). Otherwise the `get*` function could
> throw an error before your assertion.

Check out [jest-dom's documentation](https://github.com/gnapse/jest-dom#readme)
for a full list of available matchers.

## Custom Queries

`dom-testing-library` exposes many of the helper functions that are used to implement the default queries. You can use the helpers to build custom queries. For example, the code below shows a way to override the default `testId` queries to use a different data-attribute. (Note: test files would import `test-utils.js` instead of using `dom-testing-library` directly).

```js
// test-utils.js
const domTestingLib = require('dom-testing-library')
const {queryHelpers} = domTestingLib

export const queryByTestId = queryHelpers.queryByAttribute.bind(
  null,
  'data-test-id',
)
export const queryAllByTestId = queryHelpers.queryAllByAttribute.bind(
  null,
  'data-test-id',
)

export function getAllByTestId(container, id, ...rest) {
  const els = queryAllByTestId(container, id, ...rest)
  if (!els.length) {
    throw queryHelpers.getElementError(
      `Unable to find an element by: [data-test-id="${id}"]`,
      container,
    )
  }
  return els
}

export function getByTestId(...args) {
  return queryHelpers.firstResultOrNull(getAllByTestId, ...args)
}

// re-export with overrides
module.exports = {
  ...domTestingLib,
  getByTestId,
  getAllByTestId,
  queryByTestId,
  queryAllByTestId,
}
```

### Using other assertion libraries

If you're not using jest, you may be able to find a similar set of custom
assertions for your library of choice. Here's a list of alternatives to jest-dom
for other popular assertion libraries:

- [chai-dom](https://github.com/nathanboktae/chai-dom)

If you're aware of some other alternatives, please [make a pull request][prs]
and add it here!

## `TextMatch`

Several APIs accept a `TextMatch` which can be a `string`, `regex` or a
`function` which returns `true` for a match and `false` for a mismatch.

### Precision

Some APIs accept an object as the final argument that can contain options that
affect the precision of string matching:

- `exact`: Defaults to `true`; matches full strings, case-sensitive. When false,
  matches substrings and is not case-sensitive.
  - `exact` has no effect on `regex` or `function` arguments.
  - In most cases using a regex instead of a string gives you more control over
    fuzzy matching and should be preferred over `{ exact: false }`.
- `trim`: Defaults to `true`; trim leading and trailing whitespace.
- `collapseWhitespace`: Defaults to `true`. Collapses inner whitespace (newlines, tabs, repeated spaces) into a single space.

### TextMatch Examples

```javascript
// <div>
//  Hello World
// </div>

// WILL find the div:

// Matching a string:
getByText(container, 'Hello World') // full string match
getByText(container, 'llo Worl'), {exact: false} // substring match
getByText(container, 'hello world', {exact: false}) // ignore case

// Matching a regex:
getByText(container, /World/) // substring match
getByText(container, /world/i) // substring match, ignore case
getByText(container, /^hello world$/i) // full string match, ignore case
getByText(container, /Hello W?oRlD/i) // advanced regex

// Matching with a custom function:
getByText(container, (content, element) => content.startsWith('Hello'))

// WILL NOT find the div:

getByText(container, 'Goodbye World') // full string does not match
getByText(container, /hello world/) // case-sensitive regex with different case
// function looking for a span when it's actually a div:
getByText(container, (content, element) => {
  return element.tagName.toLowerCase() === 'span' && content.startsWith('Hello')
})
```

## `query` APIs

Each of the `get` APIs listed in [the 'Usage'](#usage) section above have a
complimentary `query` API. The `get` APIs will throw errors if a proper node
cannot be found. This is normally the desired effect. However, if you want to
make an assertion that an element is _not_ present in the DOM, then you can use
the `query` API instead:

```javascript
const submitButton = queryByText(container, 'submit')
expect(submitButton).toBeNull() // it doesn't exist
// or if you're using the custom matchers:
expect(submitButton).not.toBeTruthy()
```

## `queryAll` and `getAll` APIs

Each of the `query` APIs have a corresponsing `queryAll` version that always returns an Array of matching nodes. `getAll` is the same but throws when the array has a length of 0.

```javascript
const submitButtons = queryAllByText(container, 'submit')
expect(submitButtons).toHaveLength(3) // expect 3 elements
expect(submitButtons[0]).toBeTruthy()
```

## `within` and `getQueriesForElement` APIs

`within` (an alias to `getQueriesForElement`) takes a DOM element and binds it to the raw query functions, allowing them
to be used without specifying a container. It is the recommended approach for libraries built on this API
and is in use in `react-testing-library` and `vue-testing-library`.

Example: To get the text 'hello' only within a section called 'messages', you could do:

```javascript
import {within} from 'dom-testing-library'

const {getByText} = within(document.getElementById('messages'))
const helloMessage = getByText('hello')
```

## Debugging

When you use any `get` calls in your test cases, the current state of the `container`
(DOM) gets printed on the console. For example:

```javascript
// <div>Hello world</div>
getByText(container, 'Goodbye world') // will fail by throwing error
```

The above test case will fail, however it prints the state of your DOM under test,
so you will get to see:

```
Unable to find an element with the text: Goodbye world. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.
Here is the state of your container:
<div>
  <div>
    Hello World!
  </div>
</div>
```

Note: Since the DOM size can get really large, you can set the limit of DOM content
to be printed via environment variable `DEBUG_PRINT_LIMIT`. The default value is
`7000`. You will see `...` in the console, when the DOM content is stripped off,
because of the length you have set or due to default size limit. Here's how you
might increase this limit when running tests:

```
DEBUG_PRINT_LIMIT=10000 npm test
```

This works on macOS/linux, you'll need to do something else for windows. If you'd
like a solution that works for both, see [`cross-env`](https://www.npmjs.com/package/cross-env)

### `prettyDOM`

This helper function can be used to print out readable representation of the DOM
tree of a node. This can be helpful for instance when debugging tests.

It is defined as:

```typescript
function prettyDOM(node: HTMLElement, maxLength?: number): string
```

It receives the root node to print out, and an optional extra argument to limit
the size of the resulting string, for cases when it becomes too large.

This function is usually used alongside `console.log` to temporarily print out
DOM trees during tests for debugging purposes:

```javascript
const div = document.createElement('div')
div.innerHTML = '<div><h1>Hello World</h1></div>'
console.log(prettyDOM(div))
// <div>
//   <h1>Hello World</h1>
// </div>
```

This function is what also powers [the automatic debugging output described above](#debugging).

## Implementations

This library was not built to be used on its own. The original implementation
of these utilities was in the `react-testing-library`.

Implementations include:

- [`react-testing-library`](https://github.com/kentcdodds/react-testing-library)
- [`pptr-testing-library`](https://github.com/patrickhulce/pptr-testing-library)

## Using Without Jest

If you're running your tests in the browser bundled with webpack (or similar)
then `dom-testing-library` should work out of the box for you. However, most
people using `dom-testing-library` are using it with
[the Jest testing framework](https://jestjs.io/) with the `testEnvironment`
set to [`jest-environment-jsdom`](https://www.npmjs.com/package/jest-environment-jsdom)
(which is the default configuration with Jest).

[jsdom](https://github.com/jsdom/jsdom) is a pure JavaScript implementation
of the DOM and browser APIs that runs in node. If you're not using Jest and
you would like to run your tests in Node, then you must install jsdom yourself.
There's also a package called
[jsdom-global](https://github.com/rstacruz/jsdom-global) which can be used
to setup the global environment to simulate the browser APIs.

First, install jsdom and jsdom-global.

```
npm install --save-dev jsdom jsdom-global
```

With mocha, the test command would look something like this:

```
mocha --require jsdom-global/register
```

> Note, depending on the version of Node you're running, you may also need to install
> `@babel/polyfill` (if you're using babel 7) or `babel-polyfill` (for babel 6).

## FAQ

<details>

<summary>Which get method should I use?</summary>

Based on [the Guiding Principles](#guiding-principles), your test should
resemble how your code (component, page, etc.) as much as possible. With this
in mind, we recommend this order of priority:

1.  `getByLabelText`: Only really good for form fields, but this is the number 1
    method a user finds those elements, so it should be your top preference.
2.  `getByPlaceholderText`: [A placeholder is not a substitute for a label](https://www.nngroup.com/articles/form-design-placeholders/).
    But if that's all you have, then it's better than alternatives.
3.  `getByText`: Not useful for forms, but this is the number 1 method a user
    finds other elements (like buttons to click), so it should be your top
    preference for non-form elements.
4.  `getByAltText`: If your element is one which supports `alt` text
    (`img`, `area`, and `input`), then you can use this to find that element.
5.  `getByTestId`: The user cannot see (or hear) these, so this is only
    recommended for cases where you can't match by text or it doesn't make sense
    (the text is dynamic).

Other than that, you can also use the `container` to query the rendered
component as well (using the regular
[`querySelector` API](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)).

</details>

<details>

<summary>Can I write unit tests with this library?</summary>

Definitely yes! You can write unit, integration, functional, and end-to-end
tests with this library.

</details>

<details>

<summary>What if my app is localized and I don't have access to the text in test?</summary>

This is fairly common. Our first bit of advice is to try to get the default
text used in your tests. That will make everything much easier (more than just
using this utility). If that's not possible, then you're probably best
to just stick with `data-testid`s (which is not too bad anyway).

</details>

<details>

<summary>I really don't like data-testids, but none of the other queries make sense. Do I have to use a data-testid?</summary>

Definitely not. That said, a common reason people don't like the `data-testid`
attribute is they're concerned about shipping that to production. I'd suggest
that you probably want some simple E2E tests that run in production on occasion
to make certain that things are working smoothly. In that case the `data-testid`
attributes will be very useful. Even if you don't run these in production, you
may want to run some E2E tests that run on the same code you're about to ship to
production. In that case, the `data-testid` attributes will be valuable there as
well.

All that said, if you really don't want to ship `data-testid` attributes, then you
can use
[this simple babel plugin](https://www.npmjs.com/package/babel-plugin-react-remove-properties)
to remove them.

If you don't want to use them at all, then you can simply use regular DOM
methods and properties to query elements off your container.

```javascript
const firstLiInDiv = container.querySelector('div li')
const allLisInDiv = container.querySelectorAll('div li')
const rootElement = container.firstChild
```

</details>

<details>

<summary>What if I’m iterating over a list of items that I want to put the data-testid="item" attribute on. How do I distinguish them from each other?</summary>

You can make your selector just choose the one you want by including :nth-child in the selector.

```javascript
const thirdLiInUl = container.querySelector('ul > li:nth-child(3)')
```

Or you could include the index or an ID in your attribute:

```javascript
;`<li data-testid="item-${item.id}">{item.text}</li>`
```

And then you could use the `getByTestId` utility:

```javascript
const items = [
  /* your items */
]
const container = render(/* however you render this stuff */)
const thirdItem = getByTestId(container, `item-${items[2].id}`)
```

</details>

## Other Solutions

I'm not aware of any! Please feel free to make a pull request to add any here.

## Guiding Principles

> [The more your tests resemble the way your software is used, the more confidence they can give you.][guiding-principle]

We try to only expose methods and utilities that encourage you to write tests
that closely resemble how your web pages are used.

Utilities are included in this project based on the following guiding
principles:

1.  If it relates to rendering components, it deals with DOM nodes rather than
    component instances, nor should it encourage dealing with component
    instances.
2.  It should be generally useful for testing the application components in the
    way the user would use it. We _are_ making some trade-offs here because
    we're using a computer and often a simulated browser environment, but in
    general, utilities should encourage tests that use the components the way
    they're intended to be used.
3.  Utility implementations and APIs should be simple and flexible.

At the end of the day, what we want is for this library to be pretty
light-weight, simple, and understandable.

## Contributors

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars.githubusercontent.com/u/1500684?v=3" width="100px;"/><br /><sub><b>Kent C. Dodds</b></sub>](https://kentcdodds.com)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=kentcdodds "Code") [📖](https://github.com/kentcdodds/dom-testing-library/commits?author=kentcdodds "Documentation") [🚇](#infra-kentcdodds "Infrastructure (Hosting, Build-Tools, etc)") [⚠️](https://github.com/kentcdodds/dom-testing-library/commits?author=kentcdodds "Tests") | [<img src="https://avatars1.githubusercontent.com/u/2430381?v=4" width="100px;"/><br /><sub><b>Ryan Castner</b></sub>](http://audiolion.github.io)<br />[📖](https://github.com/kentcdodds/dom-testing-library/commits?author=audiolion "Documentation") | [<img src="https://avatars0.githubusercontent.com/u/8008023?v=4" width="100px;"/><br /><sub><b>Daniel Sandiego</b></sub>](https://www.dnlsandiego.com)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=dnlsandiego "Code") | [<img src="https://avatars2.githubusercontent.com/u/12592677?v=4" width="100px;"/><br /><sub><b>Paweł Mikołajczyk</b></sub>](https://github.com/Miklet)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=Miklet "Code") | [<img src="https://avatars3.githubusercontent.com/u/464978?v=4" width="100px;"/><br /><sub><b>Alejandro Ñáñez Ortiz</b></sub>](http://co.linkedin.com/in/alejandronanez/)<br />[📖](https://github.com/kentcdodds/dom-testing-library/commits?author=alejandronanez "Documentation") | [<img src="https://avatars0.githubusercontent.com/u/1402095?v=4" width="100px;"/><br /><sub><b>Matt Parrish</b></sub>](https://github.com/pbomb)<br />[🐛](https://github.com/kentcdodds/dom-testing-library/issues?q=author%3Apbomb "Bug reports") [💻](https://github.com/kentcdodds/dom-testing-library/commits?author=pbomb "Code") [📖](https://github.com/kentcdodds/dom-testing-library/commits?author=pbomb "Documentation") [⚠️](https://github.com/kentcdodds/dom-testing-library/commits?author=pbomb "Tests") | [<img src="https://avatars1.githubusercontent.com/u/1288694?v=4" width="100px;"/><br /><sub><b>Justin Hall</b></sub>](https://github.com/wKovacs64)<br />[📦](#platform-wKovacs64 "Packaging/porting to new platform") |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [<img src="https://avatars1.githubusercontent.com/u/1241511?s=460&v=4" width="100px;"/><br /><sub><b>Anto Aravinth</b></sub>](https://github.com/antoaravinth)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=antoaravinth "Code") [⚠️](https://github.com/kentcdodds/dom-testing-library/commits?author=antoaravinth "Tests") [📖](https://github.com/kentcdodds/dom-testing-library/commits?author=antoaravinth "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/3462296?v=4" width="100px;"/><br /><sub><b>Jonah Moses</b></sub>](https://github.com/JonahMoses)<br />[📖](https://github.com/kentcdodds/dom-testing-library/commits?author=JonahMoses "Documentation") | [<img src="https://avatars1.githubusercontent.com/u/4002543?v=4" width="100px;"/><br /><sub><b>Łukasz Gandecki</b></sub>](http://team.thebrain.pro)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=lgandecki "Code") [⚠️](https://github.com/kentcdodds/dom-testing-library/commits?author=lgandecki "Tests") [📖](https://github.com/kentcdodds/dom-testing-library/commits?author=lgandecki "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/498274?v=4" width="100px;"/><br /><sub><b>Ivan Babak</b></sub>](https://sompylasar.github.io)<br />[🐛](https://github.com/kentcdodds/dom-testing-library/issues?q=author%3Asompylasar "Bug reports") [🤔](#ideas-sompylasar "Ideas, Planning, & Feedback") [💻](https://github.com/kentcdodds/dom-testing-library/commits?author=sompylasar "Code") [📖](https://github.com/kentcdodds/dom-testing-library/commits?author=sompylasar "Documentation") | [<img src="https://avatars3.githubusercontent.com/u/4439618?v=4" width="100px;"/><br /><sub><b>Jesse Day</b></sub>](https://github.com/jday3)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=jday3 "Code") | [<img src="https://avatars0.githubusercontent.com/u/15199?v=4" width="100px;"/><br /><sub><b>Ernesto García</b></sub>](http://gnapse.github.io)<br />[💬](#question-gnapse "Answering Questions") [💻](https://github.com/kentcdodds/dom-testing-library/commits?author=gnapse "Code") [📖](https://github.com/kentcdodds/dom-testing-library/commits?author=gnapse "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/2747424?v=4" width="100px;"/><br /><sub><b>Josef Maxx Blake</b></sub>](http://jomaxx.com)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=jomaxx "Code") [📖](https://github.com/kentcdodds/dom-testing-library/commits?author=jomaxx "Documentation") [⚠️](https://github.com/kentcdodds/dom-testing-library/commits?author=jomaxx "Tests") |
| [<img src="https://avatars3.githubusercontent.com/u/725236?v=4" width="100px;"/><br /><sub><b>Alex Cook</b></sub>](https://github.com/alecook)<br />[📖](https://github.com/kentcdodds/dom-testing-library/commits?author=alecook "Documentation") [💡](#example-alecook "Examples") | [<img src="https://avatars3.githubusercontent.com/u/10348212?v=4" width="100px;"/><br /><sub><b>Daniel Cook</b></sub>](https://github.com/dfcook)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=dfcook "Code") [📖](https://github.com/kentcdodds/dom-testing-library/commits?author=dfcook "Documentation") [⚠️](https://github.com/kentcdodds/dom-testing-library/commits?author=dfcook "Tests") | [<img src="https://avatars2.githubusercontent.com/u/21194045?s=400&v=4" width="100px;"/><br /><sub><b>Thomas Chia</b></sub>](https://github.com/thchia)<br />[🐛](https://github.com/kentcdodds/dom-testing-library/issues?q=author%3Athchia "Bug reports") [💻](https://github.com/kentcdodds/dom-testing-library/commits?author=thchia "Code") | [<img src="https://avatars1.githubusercontent.com/u/28659384?v=4" width="100px;"/><br /><sub><b>Tim Deschryver</b></sub>](https://github.com/tdeschryver)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=tdeschryver "Code") [⚠️](https://github.com/kentcdodds/dom-testing-library/commits?author=tdeschryver "Tests") | [<img src="https://avatars3.githubusercontent.com/u/1571667?v=4" width="100px;"/><br /><sub><b>Alex Krolick</b></sub>](https://alexkrolick.com)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=alexkrolick "Code") | [<img src="https://avatars2.githubusercontent.com/u/2224291?v=4" width="100px;"/><br /><sub><b>Maddi Joyce</b></sub>](http://www.maddijoyce.com)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=maddijoyce "Code") | [<img src="https://avatars1.githubusercontent.com/u/25429764?v=4" width="100px;"/><br /><sub><b>Peter Kamps</b></sub>](https://github.com/npeterkamps)<br />[🐛](https://github.com/kentcdodds/dom-testing-library/issues?q=author%3Anpeterkamps "Bug reports") [💻](https://github.com/kentcdodds/dom-testing-library/commits?author=npeterkamps "Code") [⚠️](https://github.com/kentcdodds/dom-testing-library/commits?author=npeterkamps "Tests") |
| [<img src="https://avatars2.githubusercontent.com/u/21689428?v=4" width="100px;"/><br /><sub><b>Jonathan Stoye</b></sub>](http://jonathanstoye.de)<br />[📖](https://github.com/kentcdodds/dom-testing-library/commits?author=JonathanStoye "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/4126644?v=4" width="100px;"/><br /><sub><b>Sanghyeon Lee</b></sub>](https://github.com/yongdamsh)<br />[💡](#example-yongdamsh "Examples") | [<img src="https://avatars3.githubusercontent.com/u/8015514?v=4" width="100px;"/><br /><sub><b>Justice Mba </b></sub>](https://github.com/Dajust)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=Dajust "Code") [📖](https://github.com/kentcdodds/dom-testing-library/commits?author=Dajust "Documentation") [🤔](#ideas-Dajust "Ideas, Planning, & Feedback") | [<img src="https://avatars3.githubusercontent.com/u/340761?v=4" width="100px;"/><br /><sub><b>Wayne Crouch</b></sub>](https://github.com/wgcrouch)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=wgcrouch "Code") | [<img src="https://avatars1.githubusercontent.com/u/4996462?v=4" width="100px;"/><br /><sub><b>Ben Elliott</b></sub>](http://benjaminelliott.co.uk)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=benelliott "Code") | [<img src="https://avatars3.githubusercontent.com/u/577921?v=4" width="100px;"/><br /><sub><b>Ruben Costa</b></sub>](http://nuances.co)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=rubencosta "Code") | [<img src="https://avatars2.githubusercontent.com/u/4982001?v=4" width="100px;"/><br /><sub><b>Robert Smith</b></sub>](http://rbrtsmith.com/)<br />[🐛](https://github.com/kentcdodds/dom-testing-library/issues?q=author%3Arbrtsmith "Bug reports") [🤔](#ideas-rbrtsmith "Ideas, Planning, & Feedback") [📖](https://github.com/kentcdodds/dom-testing-library/commits?author=rbrtsmith "Documentation") |
| [<img src="https://avatars3.githubusercontent.com/u/881986?v=4" width="100px;"/><br /><sub><b>dadamssg</b></sub>](https://github.com/dadamssg)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=dadamssg "Code") | [<img src="https://avatars1.githubusercontent.com/u/186971?v=4" width="100px;"/><br /><sub><b>Neil Kistner</b></sub>](https://neilkistner.com/)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=wyze "Code") | [<img src="https://avatars3.githubusercontent.com/u/1448597?v=4" width="100px;"/><br /><sub><b>Ben Chauvette</b></sub>](http://bdchauvette.net/)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=bdchauvette "Code") | [<img src="https://avatars2.githubusercontent.com/u/777527?v=4" width="100px;"/><br /><sub><b>Jeff Baumgardt</b></sub>](https://github.com/JeffBaumgardt)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=JeffBaumgardt "Code") [📖](https://github.com/kentcdodds/dom-testing-library/commits?author=JeffBaumgardt "Documentation") | [<img src="https://avatars0.githubusercontent.com/u/4658208?v=4" width="100px;"/><br /><sub><b>Matan Kushner</b></sub>](http://matchai.me)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=matchai "Code") [📖](https://github.com/kentcdodds/dom-testing-library/commits?author=matchai "Documentation") [🤔](#ideas-matchai "Ideas, Planning, & Feedback") [⚠️](https://github.com/kentcdodds/dom-testing-library/commits?author=matchai "Tests") | [<img src="https://avatars2.githubusercontent.com/u/5779538?v=4" width="100px;"/><br /><sub><b>Alex Wendte</b></sub>](http://www.wendtedesigns.com/)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=themostcolm "Code") [📖](https://github.com/kentcdodds/dom-testing-library/commits?author=themostcolm "Documentation") [⚠️](https://github.com/kentcdodds/dom-testing-library/commits?author=themostcolm "Tests") | [<img src="https://avatars0.githubusercontent.com/u/2196208?v=4" width="100px;"/><br /><sub><b>Tamas Fodor</b></sub>](https://github.com/ruffle1986)<br />[📖](https://github.com/kentcdodds/dom-testing-library/commits?author=ruffle1986 "Documentation") |
| [<img src="https://avatars3.githubusercontent.com/u/14793495?v=4" width="100px;"/><br /><sub><b>Benjamin Eckardt</b></sub>](https://github.com/BenjaminEckardt)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=BenjaminEckardt "Code") | [<img src="https://avatars3.githubusercontent.com/u/205752?v=4" width="100px;"/><br /><sub><b>Ryan Campbell</b></sub>](https://github.com/campbellr)<br />[📖](https://github.com/kentcdodds/dom-testing-library/commits?author=campbellr "Documentation") | [<img src="https://avatars2.githubusercontent.com/u/1335519?v=4" width="100px;"/><br /><sub><b>Taylor Briggs</b></sub>](https://taylor-briggs.com)<br />[⚠️](https://github.com/kentcdodds/dom-testing-library/commits?author=TaylorBriggs "Tests") | [<img src="https://avatars2.githubusercontent.com/u/132233?v=4" width="100px;"/><br /><sub><b>John Gozde</b></sub>](https://github.com/jgoz)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=jgoz "Code") | [<img src="https://avatars2.githubusercontent.com/u/3382565?v=4" width="100px;"/><br /><sub><b>C. T. Lin</b></sub>](https://github.com/chentsulin)<br />[📖](https://github.com/kentcdodds/dom-testing-library/commits?author=chentsulin "Documentation") | [<img src="https://avatars3.githubusercontent.com/u/5312329?v=4" width="100px;"/><br /><sub><b>Terrence Wong</b></sub>](http://terrencewwong.com)<br />[💻](https://github.com/kentcdodds/dom-testing-library/commits?author=terrencewwong "Code") |

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/kentcdodds/dom-testing-library.svg?style=flat-square
[build]: https://travis-ci.org/kentcdodds/dom-testing-library
[coverage-badge]: https://img.shields.io/codecov/c/github/kentcdodds/dom-testing-library.svg?style=flat-square
[coverage]: https://codecov.io/github/kentcdodds/dom-testing-library
[version-badge]: https://img.shields.io/npm/v/dom-testing-library.svg?style=flat-square
[package]: https://www.npmjs.com/package/dom-testing-library
[downloads-badge]: https://img.shields.io/npm/dm/dom-testing-library.svg?style=flat-square
[npmtrends]: http://www.npmtrends.com/dom-testing-library
[license-badge]: https://img.shields.io/npm/l/dom-testing-library.svg?style=flat-square
[license]: https://github.com/kentcdodds/dom-testing-library/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[donate-badge]: https://img.shields.io/badge/$-support-green.svg?style=flat-square
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/kentcdodds/dom-testing-library/blob/master/CODE_OF_CONDUCT.md
[github-watch-badge]: https://img.shields.io/github/watchers/kentcdodds/dom-testing-library.svg?style=social
[github-watch]: https://github.com/kentcdodds/dom-testing-library/watchers
[github-star-badge]: https://img.shields.io/github/stars/kentcdodds/dom-testing-library.svg?style=social
[github-star]: https://github.com/kentcdodds/dom-testing-library/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20dom-testing-library%20by%20%40kentcdodds%20https%3A%2F%2Fgithub.com%2Fkentcdodds%2Fdom-testing-library%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/kentcdodds/dom-testing-library.svg?style=social
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
[set-immediate]: https://developer.mozilla.org/en-US/docs/Web/API/Window/setImmediate
[guiding-principle]: https://twitter.com/kentcdodds/status/977018512689455106
[data-testid-blog-post]: https://blog.kentcdodds.com/making-your-ui-tests-resilient-to-change-d37a6ee37269
[jest]: https://facebook.github.io/jest

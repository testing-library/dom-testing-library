import jestSnapshotSerializerAnsi from 'jest-snapshot-serializer-ansi'
import {
  getRoles,
  logRoles,
  getImplicitAriaRoles,
  isInaccessible,
} from '../role-helpers'
import {render} from './helpers/test-utils'

expect.addSnapshotSerializer(jestSnapshotSerializerAnsi)

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {})
})

afterEach(() => {
  console.log.mockRestore()
})

function setup() {
  const {getByTestId} = render(`
<header data-testid="a-header">Banner header</header>
<section aria-label="a region" data-testid='named-section'>
  <a href="http://whatever.com" data-testid="a-link">link</a>
  <a data-testid="invalid-link">invalid link</a>

  <nav data-testid='a-nav' />
  
  <h1 data-testid='a-h1'>Main Heading</h1>
  <h2 data-testid='a-h2'>Sub Heading</h2>
  <h3 data-testid='a-h3'>Tertiary Heading</h3>

  <article data-testid='a-article'>
    <ul data-testid='a-list'>
      <li data-testid='a-list-item-1'>Item 1</li>
      <li data-testid='a-list-item-2'>Item 2</li>
    </ul>

    <table data-testid='a-table'>
      <tbody data-testid='a-tbody'>
        <tr data-testid='a-row'>
          <td data-testid='a-cell-1'>Cell 1</td>
          <td data-testid='a-cell-2'>Cell 2</td>
          <td data-testid='a-cell-3'>Cell 3</td>
        </tr>
      </tbody>
    </table>

    <form aria-label="a form" data-testid='named-form'>
      <input type='radio' data-testid='a-radio-1' />
      <input type='radio' data-testid='a-radio-2' />
      <input type='text' data-testid='a-input-1' />
      <input type='text' data-testid='a-input-2' />
      <textarea data-testid='a-textarea'></textarea>
    </form>

    <ul data-testid='b-list'>
      <li data-testid='b-list-item-1'>Item 1</li>
      <li data-testid='b-list-item-2'>Item 2</li>
    </ul>

    <form data-testid="a-form" />
    <section data-testid="a-section" />
  </article>
  <dl>
    <dt data-testid="a-dt">Term</dt>
    <dd data-testid="a-dd">Definition</dd>
  </dl>

  <img src="http://example.com/image.png" data-testid='a-img-1'/>
  <img alt="" src="http://example.com/image.png" data-testid='a-img-2'/>
  <img alt="a meaningful description" src="http://example.com/image.png" data-testid='a-img-3'/>
</section>
<footer data-testid="a-footer">Contentinfo footer</footer>
  `)

  return {
    unnamedSection: getByTestId('a-section'),
    namedSection: getByTestId('named-section'),
    anchor: getByTestId('a-link'),
    h1: getByTestId('a-h1'),
    h2: getByTestId('a-h2'),
    h3: getByTestId('a-h3'),
    nav: getByTestId('a-nav'),
    article: getByTestId('a-article'),
    aUl: getByTestId('a-list'),
    aLi1: getByTestId('a-list-item-1'),
    aLi2: getByTestId('a-list-item-2'),
    bUl: getByTestId('b-list'),
    bLi1: getByTestId('b-list-item-1'),
    bLi2: getByTestId('b-list-item-2'),
    table: getByTestId('a-table'),
    tbody: getByTestId('a-tbody'),
    tr: getByTestId('a-row'),
    td1: getByTestId('a-cell-1'),
    td2: getByTestId('a-cell-2'),
    td3: getByTestId('a-cell-3'),
    unnamedForm: getByTestId('a-form'),
    namedForm: getByTestId('named-form'),
    radio: getByTestId('a-radio-1'),
    radio2: getByTestId('a-radio-2'),
    input: getByTestId('a-input-1'),
    input2: getByTestId('a-input-2'),
    textarea: getByTestId('a-textarea'),
    dt: getByTestId('a-dt'),
    dd: getByTestId('a-dd'),
    header: getByTestId('a-header'),
    invalidAnchor: getByTestId('invalid-link'),
    unnamedImg: getByTestId('a-img-1'),
    presentationImg: getByTestId('a-img-2'),
    namedImg: getByTestId('a-img-3'),
    footer: getByTestId('a-footer'),
  }
}

test('getRoles returns expected roles for various dom nodes', () => {
  const {
    anchor,
    h1,
    h2,
    h3,
    nav,
    article,
    aUl,
    aLi1,
    aLi2,
    bUl,
    bLi1,
    bLi2,
    table,
    tbody,
    tr,
    td1,
    td2,
    td3,
    radio,
    radio2,
    input,
    input2,
    textarea,
    namedSection,
    namedForm,
    dd,
    dt,
    header,
    invalidAnchor,
    unnamedSection,
    unnamedImg,
    presentationImg,
    namedImg,
    footer,
  } = setup()

  expect(getRoles(namedSection)).toEqual({
    link: [anchor],
    heading: [h1, h2, h3],
    navigation: [nav],
    radio: [radio, radio2],
    article: [article],
    list: [aUl, bUl],
    listitem: [aLi1, aLi2, bLi1, bLi2],
    table: [table],
    row: [tr],
    cell: [td1, td2, td3],
    textbox: [input, input2, textarea],
    rowgroup: [tbody],
    form: [namedForm],
    region: [namedSection],
    term: [dt],
    definition: [dd],
    generic: [invalidAnchor, unnamedSection],
    img: [unnamedImg, namedImg],
    presentation: [presentationImg],
  })
  expect(getRoles(header)).toEqual({
    banner: [header],
  })
  expect(getRoles(footer)).toEqual({
    contentinfo: [footer],
  })
})

test('logRoles calls console.log with output from prettyRoles', () => {
  const {namedSection} = setup()
  logRoles(namedSection)
  expect(console.log).toHaveBeenCalledTimes(1)
  expect(console.log.mock.calls[0][0]).toMatchSnapshot()
})

test('getImplicitAriaRoles returns expected roles for various dom nodes', () => {
  const {namedSection, h1, unnamedForm, radio, input} = setup()

  expect(getImplicitAriaRoles(namedSection)).toEqual(['region'])
  expect(getImplicitAriaRoles(h1)).toEqual(['heading'])
  expect(getImplicitAriaRoles(unnamedForm)).toEqual([])
  expect(getImplicitAriaRoles(radio)).toEqual(['radio'])
  expect(getImplicitAriaRoles(input)).toEqual(['textbox'])
})

test.each([
  ['<div />', false],
  ['<div aria-hidden="false" />', false],
  ['<div style="visibility: visible" />', false],
  ['<div hidden />', true],
  ['<div style="display: none;"/>', true],
  ['<div style="visibility: hidden;"/>', true],
  ['<div aria-hidden="true" />', true],
])('shouldExcludeFromA11yTree for %s returns %p', (html, expected) => {
  const {container} = render(html)
  container.firstChild.appendChild(document.createElement('button'))

  expect(isInaccessible(container.querySelector('button'))).toBe(expected)
})

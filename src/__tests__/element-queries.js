import {configure} from '../config'
import {render, renderIntoDocument} from './helpers/test-utils'

test('query can return null', () => {
  const {
    queryByLabelText,
    queryByDisplayValue,
    queryByPlaceholderText,
    queryByText,
    queryByTestId,
    queryByAltText,
  } = render('<div />')
  expect(queryByTestId('LucyRicardo')).toBeNull()
  expect(queryByLabelText('LucyRicardo')).toBeNull()
  expect(queryByDisplayValue('LucyRicardo')).toBeNull()
  expect(queryByPlaceholderText('LucyRicardo')).toBeNull()
  expect(queryByText('LucyRicardo')).toBeNull()
  expect(queryByAltText('LucyRicardo')).toBeNull()
})

test('get throws a useful error message', () => {
  const {
    getByLabelText,
    getByDisplayValue,
    getByPlaceholderText,
    getByText,
    getByTestId,
    getByAltText,
    getByTitle,
    getByRole,
  } = render(
    `<div></div><!-- Ignored comment --><style type="text/css">body {} </style><script type="text/javascript></script>`,
  )
  expect(() => getByLabelText('LucyRicardo'))
    .toThrowErrorMatchingInlineSnapshot(`
    Unable to find a label with the text of: LucyRicardo

    Ignored nodes: comments, <script />, <style />
    <div>
      <div />
    </div>
  `)
  expect(() => getByPlaceholderText('LucyRicardo'))
    .toThrowErrorMatchingInlineSnapshot(`
    Unable to find an element with the placeholder text of: LucyRicardo

    Ignored nodes: comments, <script />, <style />
    <div>
      <div />
    </div>
  `)
  expect(() => getByText('LucyRicardo')).toThrowErrorMatchingInlineSnapshot(`
    Unable to find an element with the text: LucyRicardo. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

    Ignored nodes: comments, <script />, <style />
    <div>
      <div />
    </div>
  `)
  expect(() => getByText('Lucy      Ricardo'))
    .toThrowErrorMatchingInlineSnapshot(`
    Unable to find an element with the text: Lucy Ricardo (normalized from 'Lucy      Ricardo'). This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

    Ignored nodes: comments, <script />, <style />
    <div>
      <div />
    </div>
  `)
  expect(() => getByTestId('LucyRicardo')).toThrowErrorMatchingInlineSnapshot(`
    Unable to find an element by: [data-testid="LucyRicardo"]

    Ignored nodes: comments, <script />, <style />
    <div>
      <div />
    </div>
  `)
  expect(() => getByAltText('LucyRicardo')).toThrowErrorMatchingInlineSnapshot(`
    Unable to find an element with the alt text: LucyRicardo

    Ignored nodes: comments, <script />, <style />
    <div>
      <div />
    </div>
  `)
  expect(() => getByTitle('LucyRicardo')).toThrowErrorMatchingInlineSnapshot(`
    Unable to find an element with the title: LucyRicardo.

    Ignored nodes: comments, <script />, <style />
    <div>
      <div />
    </div>
  `)
  expect(() => getByDisplayValue('LucyRicardo'))
    .toThrowErrorMatchingInlineSnapshot(`
    Unable to find an element with the display value: LucyRicardo.

    Ignored nodes: comments, <script />, <style />
    <div>
      <div />
    </div>
  `)
  expect(() => getByRole('LucyRicardo')).toThrowErrorMatchingInlineSnapshot(`
    Unable to find an accessible element with the role "LucyRicardo"

    There are no accessible roles. But there might be some inaccessible roles. If you wish to access them, then set the \`hidden\` option to \`true\`. Learn more about this here: https://testing-library.com/docs/dom-testing-library/api-queries#byrole

    Ignored nodes: comments, <script />, <style />
    <div>
      <div />
    </div>
  `)
})

test('can get elements by matching their text content', () => {
  const {queryByText} = render(`
    <div>
      <span>Currently showing</span>
      <span>
        Step
        1
          of 4
      </span>
    </div>
  `)
  expect(queryByText('Currently showing')).toBeTruthy()
  expect(queryByText('Step 1 of 4')).toBeTruthy()
})

test('can get elements by matching their text across adjacent text nodes', () => {
  const textDiv = document.createElement('div')
  const textNodeContent = ['£', '24', '.', '99']
  textNodeContent
    .map(text => document.createTextNode(text))
    .forEach(textNode => textDiv.appendChild(textNode))

  const {container, queryByText} = render('<div />')
  container.appendChild(textDiv)
  expect(queryByText('£24.99')).toBeTruthy()
})

test('can get input elements with type submit, button, or reset', () => {
  const {queryByText} = render(`
    <div>
      <input type="submit" value="Send data"/>
      <input type="reset" value="Clear EVERYTHING"/>
      <input type="button" value="Push me!"/>
      <input type="text" value="user data" />
    </div>
  `)
  expect(queryByText('Send data')).toBeTruthy()
  expect(queryByText('Clear EVERYTHING')).toBeTruthy()
  expect(queryByText('Push me!')).toBeTruthy()
  expect(queryByText('user data')).toBeFalsy()
})

test('matches case with RegExp matcher', () => {
  const {queryByText} = render(`
    <span>STEP 1 of 4</span>
  `)
  expect(queryByText(/STEP 1 of 4/)).toBeTruthy()
  expect(queryByText(/Step 1 of 4/)).not.toBeTruthy()
})

test('queryByText matches case with non-string matcher', () => {
  const {queryByText} = render(`<span>1</span>`)
  expect(queryByText(1)).toBeTruthy()
})

test('can get form controls by label text', () => {
  const {getByLabelText} = render(`
    <div>
      <label>
        1st<input id="first-id" />
      </label>
      <div>
        <label for="second-id">2nd</label>
        <input id="second-id" />
      </div>
      <div>
        <label id="third-label">3rd</label>
        <input aria-labelledby="third-label" id="third-id" />
      </div>
      <div>
        <label for="fourth.id">4th</label>
        <input id="fourth.id" />
      </div>
      <div>
      <div>
        <label id="fifth-label-one">5th one</label>
        <label id="fifth-label-two">5th two</label>
        <input aria-labelledby="fifth-label-one fifth-label-two" id="fifth-id" />
      </div>
      <div>
        <input id="sixth-label-one" value="6th one"/>
        <input id="sixth-label-two" value="6th two"/>
        <label id="sixth-label-three">6th three</label>
        <input aria-labelledby="sixth-label-one sixth-label-two sixth-label-three" id="sixth-id" />
      </div>
      <div>
        <span id="seventh-label-one">7th one</span>
        <input aria-labelledby="seventh-label-one" id="seventh-id" />
      </div>
      <div>
        <label id="eighth.label">8th one</label>
        <input aria-labelledby="eighth.label" id="eighth.id" />
      </div>
    </div>
  `)
  expect(getByLabelText('1st').id).toBe('first-id')
  expect(getByLabelText('2nd').id).toBe('second-id')
  expect(getByLabelText('3rd').id).toBe('third-id')
  expect(getByLabelText('4th').id).toBe('fourth.id')
  expect(getByLabelText('5th one').id).toBe('fifth-id')
  expect(getByLabelText('5th two').id).toBe('fifth-id')
  expect(getByLabelText('6th one').id).toBe('sixth-id')
  expect(getByLabelText('6th two').id).toBe('sixth-id')
  expect(getByLabelText('6th one 6th two').id).toBe('sixth-id')
  expect(getByLabelText('6th one 6th two 6th three').id).toBe('sixth-id')
  expect(getByLabelText('7th one').id).toBe('seventh-id')
  expect(getByLabelText('8th one').id).toBe('eighth.id')
})

test('can get elements labelled with aria-labelledby attribute', () => {
  const {getByLabelText, getAllByLabelText} = render(`
    <div>
      <h1 id="content-header">The Gettysburg Address</h1>
      <main id="sibling-of-content-header" aria-labelledby="content-header">
        <section aria-labelledby="content-header section-one-header" id="section-one">
          <h2 id="section-one-header">Section One</h2>
          <p>Four score and seven years ago, ...</p>
        </section>
      </main>
      <p>The Gettysburg Address</p>
    </div>
  `)
  const result = getAllByLabelText('The Gettysburg Address').map(el => el.id)
  expect(result).toHaveLength(2)
  expect(result).toEqual(
    expect.arrayContaining(['sibling-of-content-header', 'section-one']),
  )
  expect(getByLabelText('Section One').id).toBe('section-one')
})

test('can get sibling elements with aria-labelledby attribute', () => {
  const {getAllByLabelText} = render(`
    <div>
      <svg id="icon" aria-labelledby="icon-desc"></svg>
      <span id="icon-desc">Tacos</span>
    </div>
  `)

  const result = getAllByLabelText('Tacos')
  expect(result).toHaveLength(1)
  expect(result[0].id).toBe('icon')
})

test('can filter results of label query based on selector', () => {
  const {getAllByLabelText} = render(`
    <div>
      <label id="label1" for="input1">
        Test Label
        <input id="input2" />
      </label>
      <input id="input1" class="fancy-input" />
      <span aria-labelledby="label1">Some hint text</span>
    </div>
  `)

  const result = getAllByLabelText('Test Label', {selector: '.fancy-input'})
  expect(result).toHaveLength(1)
  expect(result[0].id).toBe('input1')
})

test('can find any labelable element when label text is inside other elements', () => {
  const {getByLabelText} = render(`
    <label>
      <span>Test</span>
      <span>Label</span>
      <button />
      <input />
      <meter />
      <output />
      <progress />
      <select />
      <textarea />
    </label>
  `)

  const nodeTypes = [
    'button',
    'input',
    'meter',
    'output',
    'progress',
    'select',
    'textarea',
  ]
  nodeTypes.forEach(nodeType => {
    expect(getByLabelText('Test Label', {selector: nodeType}).nodeName).toEqual(
      nodeType.toUpperCase(),
    )
  })
})

// According to the spec, the first descendant of a label that is a labelable element is the labeled control
// https://html.spec.whatwg.org/multipage/forms.html#the-label-element
test('returns the labelable element control inside a label', () => {
  const {getByLabelText} = render(`
    <label>
      <span>Test</span>
      <span>Label</span>
      <button />
      <input />
      <meter />
      <output />
      <progress />
      <select />
      <textarea ></textarea>
    </label>
  `)

  expect(getByLabelText('Test Label').nodeName).toEqual('BUTTON')
})

test('can find non-input elements when aria-labelledby a label', () => {
  const {getAllByLabelText} = render(`
    <div>
      <label id="label1">Test Label</label>
      <ul aria-labelledby="label1">
        <li>Hello</li>
      </ul
    </div>
  `)

  const result = getAllByLabelText('Test Label')
  expect(result).toHaveLength(1)
  expect(result[0].nodeName).toBe('UL')
})

test('can find the correct element when there are multiple matching labels', () => {
  const {getByLabelText} = render(`
    <label>
      Test Label
      <input />
    </label>
    <label>
      Test Label
      <textarea></textarea>
    </label>
  `)

  const result = getByLabelText('Test Label', {selector: 'input'})
  expect(result.nodeName).toBe('INPUT')
})

test('get can get form controls by placeholder', () => {
  const {getByPlaceholderText} = render(`
    <input id="username-id" placeholder="username" />,
  `)
  expect(getByPlaceholderText('username').id).toBe('username-id')
})

test('queryByPlaceholderText matches case with non-string matcher', () => {
  const {queryByPlaceholderText} = render(`<input placeholder="1" />`)
  expect(queryByPlaceholderText(1)).toBeTruthy()
})

test('label with no form control', () => {
  const {getByLabelText, queryByLabelText} = render(`<label>All alone</label>`)
  expect(queryByLabelText(/alone/)).toBeNull()
  expect(() => getByLabelText(/alone/)).toThrowErrorMatchingInlineSnapshot(`
    Found a label with the text of: /alone/, however no form control was found associated to that label. Make sure you're using the "for" attribute or "aria-labelledby" attribute correctly.

    Ignored nodes: comments, <script />, <style />
    <div>
      <label>
        All alone
      </label>
    </div>
  `)
})

test('label with "for" attribute but no form control and fuzzy matcher', () => {
  const {getByLabelText, queryByLabelText} = render(
    `<label for="foo">All alone label</label>`,
  )
  expect(queryByLabelText('alone', {exact: false})).toBeNull()
  expect(() => getByLabelText('alone', {exact: false}))
    .toThrowErrorMatchingInlineSnapshot(`
    Found a label with the text of: alone, however no form control was found associated to that label. Make sure you're using the "for" attribute or "aria-labelledby" attribute correctly.

    Ignored nodes: comments, <script />, <style />
    <div>
      <label
        for="foo"
      >
        All alone label
      </label>
    </div>
  `)
})

test('label with children with no form control', () => {
  const {getByLabelText, queryByLabelText} = render(`
  <label>
    All alone but with children
    <textarea>Hello</textarea>
    <select><option value="0">zero</option></select>
  </label>`)
  expect(queryByLabelText(/alone/, {selector: 'input'})).toBeNull()
  expect(() => getByLabelText(/alone/, {selector: 'input'}))
    .toThrowErrorMatchingInlineSnapshot(`
    Found a label with the text of: /alone/, however no form control was found associated to that label. Make sure you're using the "for" attribute or "aria-labelledby" attribute correctly.

    Ignored nodes: comments, <script />, <style />
    <div>
      
      
      <label>
        
        All alone but with children
        
        <textarea>
          Hello
        </textarea>
        
        
        <select>
          <option
            value="0"
          >
            zero
          </option>
        </select>
        
      
      </label>
    </div>
  `)
})

test('label with non-labellable element', () => {
  const {getByLabelText, queryByLabelText} = render(`
  <div>
    <label for="div1">Label 1</label>
    <div id="div1">
      Hello
    </div>
  </div>
  `)

  expect(queryByLabelText(/Label/)).toBeNull()
  expect(() => getByLabelText(/Label/)).toThrowErrorMatchingInlineSnapshot(`
    Found a label with the text of: /Label/, however the element associated with this label (<div />) is non-labellable [https://html.spec.whatwg.org/multipage/forms.html#category-label]. If you really need to label a <div />, you can use aria-label or aria-labelledby instead.

    Ignored nodes: comments, <script />, <style />
    <div>
      
      
      <div>
        
        
        <label
          for="div1"
        >
          Label 1
        </label>
        
        
        <div
          id="div1"
        >
          
          Hello
        
        </div>
        
      
      </div>
      
      
    </div>
  `)
})

test('multiple labels with non-labellable elements', () => {
  const {getAllByLabelText, queryAllByLabelText} = render(`
  <div>
    <label for="span1">Label 1</label>
    <span id="span1">
      Hello
    </span>
    <label for="p1">Label 2</label>
    <p id="p1">
      World
    </p>
  </div>
  `)

  expect(queryAllByLabelText(/Label/)).toEqual([])
  expect(() => getAllByLabelText(/Label/)).toThrowErrorMatchingInlineSnapshot(`
    Found a label with the text of: /Label/, however the element associated with this label (<span />) is non-labellable [https://html.spec.whatwg.org/multipage/forms.html#category-label]. If you really need to label a <span />, you can use aria-label or aria-labelledby instead.

    Found a label with the text of: /Label/, however the element associated with this label (<p />) is non-labellable [https://html.spec.whatwg.org/multipage/forms.html#category-label]. If you really need to label a <p />, you can use aria-label or aria-labelledby instead.

    Ignored nodes: comments, <script />, <style />
    <div>
      
      
      <div>
        
        
        <label
          for="span1"
        >
          Label 1
        </label>
        
        
        <span
          id="span1"
        >
          
          Hello
        
        </span>
        
        
        <label
          for="p1"
        >
          Label 2
        </label>
        
        
        <p
          id="p1"
        >
          
          World
        
        </p>
        
      
      </div>
      
      
    </div>
  `)
})

test('totally empty label', () => {
  const {getByLabelText, queryByLabelText} = render(`<label />`)
  expect(queryByLabelText('')).toBeNull()
  expect(() => getByLabelText('')).toThrowErrorMatchingInlineSnapshot(`
    Found a label with the text of: , however no form control was found associated to that label. Make sure you're using the "for" attribute or "aria-labelledby" attribute correctly.

    Ignored nodes: comments, <script />, <style />
    <div>
      <label />
    </div>
  `)
})

test('getByLabelText with aria-label', () => {
  // not recommended normally, but supported for completeness
  const {queryByLabelText} = render(`<input aria-label="batman" />`)
  expect(queryByLabelText(/bat/)).toBeTruthy()
})

test('queryByLabelText matches case with non-string matcher', () => {
  const {queryByLabelText} = render(`<input aria-label="1" />`)
  expect(queryByLabelText(1)).toBeTruthy()
})

test('get element by its alt text', () => {
  const {getByAltText} = render(`
    <div>
      <input data-info="no alt here" />
      <img alt="finding nemo poster" src="/finding-nemo.png" />
    </div>,
  `)
  expect(getByAltText(/fin.*nem.*poster$/i).src).toContain('/finding-nemo.png')
})

test('queryByAltText matches case with non-string matcher', () => {
  const {queryByAltText} = render(`<img alt="1" src="/finding-nemo.png" />`)
  expect(queryByAltText(1)).toBeTruthy()
})

test('query/get element by its title', () => {
  const {getByTitle, queryByTitle} = render(`
    <div>
        <span title="Ignore this" id="1"/>
        <span title="Delete" id="2"/>
        <span title="Ignore this as well" id="3"/>
        <div title="WrongTitle" id="4">HelloWorld</div>
    </div>
  `)

  expect(getByTitle('Delete').id).toEqual('2')
  expect(queryByTitle('Delete').id).toEqual('2')
  expect(queryByTitle('Del', {exact: false}).id).toEqual('2')
  expect(queryByTitle('HelloWorld')).toBeNull()
})

test('query/get title element of SVG', () => {
  const {getByTitle, queryByTitle} = render(`
    <div>
        <svg>
            <title id="svg-title">Close</title>
            <g>
              <path />
            </g>
        </svg>
    </div>
  `)

  expect(getByTitle('Close').id).toEqual('svg-title')
  expect(queryByTitle('Close').id).toEqual('svg-title')
})

test('queryByTitle matches case with non-string matcher', () => {
  const {queryByTitle} = render(`<span title="1" />`)
  expect(queryByTitle(1)).toBeTruthy()
})

test('query/get element by its value', () => {
  const {getByDisplayValue, queryByDisplayValue} = render(`  <div>
    <input placeholder="name" type="text"/>
    <input placeholder="lastname" type="text" value="Norris"/>
    <input placeholder="email" type="text"/>
  </div>
  `)

  expect(getByDisplayValue('Norris').placeholder).toEqual('lastname')
  expect(queryByDisplayValue('Norris').placeholder).toEqual('lastname')
})

test('query/get select by text with the default option selected', () => {
  const {getByDisplayValue, queryByDisplayValue} = render(`
  <select id="state-select">
    <option value="">State</option>
    <option value="AL">Alabama</option>
    <option value="AK" >Alaska</option>
    <option value="AZ">Arizona</option>
  </select>
  `)

  expect(getByDisplayValue('State').id).toEqual('state-select')
  expect(queryByDisplayValue('State').id).toEqual('state-select')
})

test('query/get select by text with one option selected', () => {
  const {getByDisplayValue, queryByDisplayValue} = render(`
  <select id="state-select">
    <option value="">State</option>
    <option value="AL">Alabama</option>
    <option selected value="AK" >Alaska</option>
    <option value="AZ">Arizona</option>
  </select>
  `)

  expect(getByDisplayValue('Alaska').id).toEqual('state-select')
  expect(queryByDisplayValue('Alaska').id).toEqual('state-select')
})

test('query/get select by text with multiple options selected', () => {
  const {getByDisplayValue, queryByDisplayValue} = render(`
  <select multiple id="state-select">
    <option value="">State</option>
    <option selected value="AL">Alabama</option>
    <option selected value="AK" >Alaska</option>
    <option value="AZ">Arizona</option>
  </select>
  `)

  expect(getByDisplayValue('Alabama').id).toEqual('state-select')
  expect(queryByDisplayValue('Alaska').id).toEqual('state-select')
})

test('queryByDisplayValue matches case with non-string matcher', () => {
  const {queryByDisplayValue} = render(`
  <select multiple id="state-select">
    <option selected value="one">1</option>
  </select>
  `)
  expect(queryByDisplayValue(1)).toBeTruthy()
})

describe('query by test id', () => {
  afterEach(() => {
    // Restore the default test id attribute
    // even if these tests failed
    configure({testIdAttribute: 'data-testid'})
  })

  test('can get elements by test id', () => {
    const {queryByTestId} = render(`<div data-testid="firstName"></div>`)
    expect(queryByTestId('firstName')).toBeTruthy()
    expect(queryByTestId(/first/)).toBeTruthy()
    expect(queryByTestId(testid => testid === 'firstName')).toBeTruthy()
    // match should be exact, case-sensitive
    expect(queryByTestId('firstname')).not.toBeTruthy()
    expect(queryByTestId('first')).not.toBeTruthy()
    expect(queryByTestId('firstNamePlusMore')).not.toBeTruthy()
    expect(queryByTestId('first-name')).not.toBeTruthy()
  })

  test('queryByTestId matches case with non-string matcher', () => {
    const {queryByTestId} = render(`<span data-testid="1" />`)
    expect(queryByTestId(1)).toBeTruthy()
  })

  test('can override test id attribute', () => {
    const {queryByTestId} = render(`<div data-my-test-id="theTestId"></div>`)

    configure({testIdAttribute: 'data-my-test-id'})
    expect(queryByTestId('theTestId')).toBeTruthy()

    configure({testIdAttribute: 'something-else'})
    expect(queryByTestId('theTestId')).toBeFalsy()
  })
})

test('queryAllByRole returns semantic html elements', () => {
  const {queryAllByRole} = render(`
    <form>
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <h4>Heading 4</h4>
      <h5>Heading 5</h5>
      <h6>Heading 6</h6>
      <svg role="img">
        <rect width="100" height="100" />
      </svg>
      <ol>
        <li></li>
        <li></li>
      </ol>
      <ul>
        <li></li>
      </ul>
      <input>
      <input type="text">
      <input type="checkbox">
      <input type="radio">
      <table>
        <thead>
          <tr>
            <th></th>
            <th scope="row"></th>
          </tr>
        </thead>
        <tbody>
          <tr></tr>
          <tr></tr>
        </tbody>
      </table>
      <table role="grid"></table>
      <div role="meter progressbar" />
      <button>Button</button>
      <select><option value="1">one</option></select>
      <select size="2">
        <option value="1">one</option>
        <option value="2">two</option>
      </select>
    </form>
  `)

  expect(queryAllByRole(/table/i)).toHaveLength(1)
  expect(queryAllByRole(/tabl/i, {exact: false})).toHaveLength(1)
  expect(queryAllByRole(/columnheader/i)).toHaveLength(1)
  expect(queryAllByRole(/rowheader/i)).toHaveLength(1)
  expect(queryAllByRole(/grid/i)).toHaveLength(1)
  expect(queryAllByRole(/form/i)).toHaveLength(0)
  expect(queryAllByRole(/button/i)).toHaveLength(1)
  expect(queryAllByRole(/heading/i)).toHaveLength(6)
  expect(queryAllByRole('list')).toHaveLength(2)
  expect(queryAllByRole(/listitem/i)).toHaveLength(3)
  expect(queryAllByRole(/textbox/i)).toHaveLength(2)
  expect(queryAllByRole(/checkbox/i)).toHaveLength(1)
  expect(queryAllByRole(/radio/i)).toHaveLength(1)
  expect(queryAllByRole('row')).toHaveLength(3)
  expect(queryAllByRole(/rowgroup/i)).toHaveLength(2)
  expect(queryAllByRole(/(table)|(textbox)/i)).toHaveLength(3)
  expect(queryAllByRole(/img/i)).toHaveLength(1)
  expect(queryAllByRole('meter')).toHaveLength(1)
  expect(queryAllByRole('progressbar')).toHaveLength(0)
  expect(queryAllByRole('progressbar', {queryFallbacks: true})).toHaveLength(1)
  expect(queryAllByRole('combobox')).toHaveLength(1)
  expect(queryAllByRole('listbox')).toHaveLength(1)
})

test('queryByRole matches case with non-string matcher', () => {
  const {queryByRole} = render(`<span role="1" />`)
  expect(queryByRole(1)).toBeTruthy()
})

test('getAll* matchers return an array', () => {
  const {
    getAllByAltText,
    getAllByTestId,
    getAllByLabelText,
    getAllByDisplayValue,
    getAllByPlaceholderText,
    getAllByText,
    getAllByRole,
  } = render(`
    <div role="container">
      <img
        data-testid="poster"
        alt="finding nemo poster"
        src="/finding-nemo.png" />
      <img
        data-testid="poster"
        alt="finding dory poster"
        src="/finding-dory.png" />
      <img
        data-testid="poster"
        alt="jumanji poster"
        src="/jumanji.png" />
      <p>Where to next?</p>
      <label for="username">User Name</label>
      <input id="username" placeholder="Dwayne 'The Rock' Johnson" />
      <select>
        <option value="">German cars</option>
        <option value="volvo">BMW</option>
        <option value="audi">Audi</option>
      </select>
      <select>
        <option value="">Japanese cars</option>
        <option value="volvo">Toyota</option>
        <option value="audi">Honda</option>
      </select>
      <div role="meter progressbar" />
    </div>,
  `)
  expect(getAllByAltText(/finding.*poster$/i)).toHaveLength(2)
  expect(getAllByAltText(/jumanji/)).toHaveLength(1)
  expect(getAllByTestId('poster')).toHaveLength(3)
  expect(getAllByPlaceholderText(/The Rock/)).toHaveLength(1)
  expect(getAllByLabelText('User Name')).toHaveLength(1)
  expect(getAllByDisplayValue('Japanese cars')).toHaveLength(1)
  expect(getAllByDisplayValue(/cars$/)).toHaveLength(2)
  expect(getAllByText(/^where/i)).toHaveLength(1)
  expect(getAllByRole(/container/i)).toHaveLength(1)
  expect(getAllByRole('meter')).toHaveLength(1)
  expect(getAllByRole('progressbar', {queryFallbacks: true})).toHaveLength(1)
})

test('getAll* matchers throw for 0 matches', () => {
  const {
    getAllByAltText,
    getAllByTestId,
    getAllByLabelText,
    getAllByDisplayValue,
    getAllByPlaceholderText,
    getAllByText,
    getAllByRole,
  } = render(`
    <div role="container">
      <label>No Matches Please</label>
    </div>,
  `)
  expect(() => getAllByTestId('nope')).toThrow()
  expect(() => getAllByTestId('abc')).toThrow()
  expect(() => getAllByAltText('nope')).toThrow()
  expect(() => getAllByLabelText('nope')).toThrow()
  expect(() => getAllByLabelText('no matches please')).toThrow()
  expect(() => getAllByDisplayValue('nope')).toThrow()
  expect(() => getAllByPlaceholderText('nope')).toThrow()
  expect(() => getAllByText('nope')).toThrow()
  expect(() => getAllByRole('nope')).toThrow()
  expect(() => getAllByDisplayValue('nope')).toThrow()
})

test('queryAll* matchers return an array for 0 matches', () => {
  const {
    queryAllByAltText,
    queryAllByTestId,
    queryAllByLabelText,
    queryAllByDisplayValue,
    queryAllByPlaceholderText,
    queryAllByText,
    queryAllByRole,
  } = render(`
    <div>
    </div>,
  `)
  expect(queryAllByTestId('nope')).toHaveLength(0)
  expect(queryAllByAltText('nope')).toHaveLength(0)
  expect(queryAllByLabelText('nope')).toHaveLength(0)
  expect(queryAllByDisplayValue('nope')).toHaveLength(0)
  expect(queryAllByPlaceholderText('nope')).toHaveLength(0)
  expect(queryAllByText('nope')).toHaveLength(0)
  expect(queryAllByRole('nope')).toHaveLength(0)
})

test('queryAllByText can query dom nodes', () => {
  const {queryAllByText} = render('hi')
  expect(queryAllByText('hi')).toHaveLength(1)
  expect(queryAllByText('not here')).toHaveLength(0)
  expect(queryAllByText('hi', {selector: 'span'})).toHaveLength(0)
})

test('queryAllByText works with document container', () => {
  // This is required for Cypress as it uses `document`
  // as the container for all methods
  const {queryAllByText} = renderIntoDocument('<p>hello</p>')
  expect(queryAllByText('hello')).toHaveLength(1)
  expect(queryAllByText('not here')).toHaveLength(0)
  expect(queryAllByText('hello', {selector: 'span'})).toHaveLength(0)
})

test('using jest helpers to assert element states', () => {
  const {queryByTestId} = render(`<span data-testid="count-value">2</span>`)

  // other ways to assert your test cases, but you don't need all of them.
  expect(queryByTestId('count-value')).toBeTruthy()
  expect(queryByTestId('count-value1')).not.toBeTruthy()
  expect(queryByTestId('count-value')).toHaveTextContent('2')
  expect(queryByTestId('count-value')).not.toHaveTextContent('21')
  expect(() =>
    expect(queryByTestId('count-value2')).toHaveTextContent('2'),
  ).toThrowError()

  // negative test cases wrapped in throwError assertions for coverage.
  expect(() =>
    expect(queryByTestId('count-value')).not.toBeTruthy(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('count-value1')).toBeTruthy(),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('count-value')).toHaveTextContent('3'),
  ).toThrowError()
  expect(() =>
    expect(queryByTestId('count-value')).not.toHaveTextContent('2'),
  ).toThrowError()
})

test('using jest helpers to check element attributes', () => {
  const {getByTestId} = render(`
    <button data-testid="ok-button" type="submit" disabled>
      OK
    </button>
  `)

  expect(getByTestId('ok-button')).toBeDisabled()
  expect(getByTestId('ok-button')).toHaveAttribute('type')
  expect(getByTestId('ok-button')).not.toHaveAttribute('class')
  expect(getByTestId('ok-button')).toHaveAttribute('type', 'submit')
  expect(getByTestId('ok-button')).not.toHaveAttribute('type', 'button')

  expect(() => expect(getByTestId('ok-button')).toBeEnabled()).toThrowError()
  expect(() =>
    expect(getByTestId('ok-button')).not.toHaveAttribute('type'),
  ).toThrowError()
  expect(() =>
    expect(getByTestId('ok-button')).toHaveAttribute('class'),
  ).toThrowError()
  expect(() =>
    expect(getByTestId('ok-button')).not.toHaveAttribute('type', 'submit'),
  ).toThrowError()
  expect(() =>
    expect(getByTestId('ok-button')).toHaveAttribute('type', 'button'),
  ).toThrowError()
})

test('using jest helpers to check element class names', () => {
  const {getByTestId} = render(`
    <div>
      <button data-testid="delete-button" class="btn extra btn-danger">
        Delete item
      </button>
      <button data-testid="cancel-button">
        Cancel
      </button>
    </div>
  `)

  expect(getByTestId('delete-button')).toHaveClass('btn')
  expect(getByTestId('delete-button')).toHaveClass('btn-danger')
  expect(getByTestId('delete-button')).toHaveClass('extra')
  expect(getByTestId('delete-button')).not.toHaveClass('xtra')
  expect(getByTestId('delete-button')).toHaveClass('btn btn-danger')
  expect(getByTestId('delete-button')).not.toHaveClass('btn-link')
  expect(getByTestId('cancel-button')).not.toHaveClass('btn-danger')

  expect(() =>
    expect(getByTestId('delete-button')).not.toHaveClass('btn'),
  ).toThrowError()
  expect(() =>
    expect(getByTestId('delete-button')).not.toHaveClass('btn-danger'),
  ).toThrowError()
  expect(() =>
    expect(getByTestId('delete-button')).not.toHaveClass('extra'),
  ).toThrowError()
  expect(() =>
    expect(getByTestId('delete-button')).toHaveClass('xtra'),
  ).toThrowError()
  expect(() =>
    expect(getByTestId('delete-button')).not.toHaveClass('btn btn-danger'),
  ).toThrowError()
  expect(() =>
    expect(getByTestId('delete-button')).toHaveClass('btn-link'),
  ).toThrowError()
  expect(() =>
    expect(getByTestId('cancel-button')).toHaveClass('btn-danger'),
  ).toThrowError()
})

test('using jest helpers to check element role', () => {
  const {getByRole} = render(`
    <div role="dialog">
      <span>Contents</span>
    </div>
  `)

  expect(getByRole('dialog')).toHaveTextContent('Contents')
})

test('using jest helpers to check element fallback roles', () => {
  const {getByRole} = render(`
    <div role="meter progressbar">
      <span>Contents</span>
    </div>
  `)

  expect(getByRole('progressbar', {queryFallbacks: true})).toHaveTextContent(
    'Contents',
  )
})

test('the debug helper prints the dom state here', () => {
  const originalDebugPrintLimit = process.env.DEBUG_PRINT_LIMIT
  const Large = `<div>
        ${Array.from({length: 7000}, (v, key) => key).map(() => {
          return `<div data-testid="debugging" data-otherid="debugging">
                Hello World!
            </div>`
        })}
    </div>`

  const {getByText} = renderIntoDocument(Large) // render large DOM which exceeds 7000 limit
  expect(() => expect(getByText('not present')).toBeTruthy()).toThrowError()

  const Hello = `<div data-testid="debugging" data-otherid="debugging">
        Hello World!
    </div>`
  const {getByTestId} = renderIntoDocument(Hello)
  process.env.DEBUG_PRINT_LIMIT = 5 // user should see `...`
  expect(() => expect(getByTestId('not present')).toBeTruthy()).toThrowError(
    /\.\.\.$/,
  )

  const {getByLabelText} = renderIntoDocument(Hello)
  process.env.DEBUG_PRINT_LIMIT = 10000 // user shouldn't see `...`
  expect(() =>
    expect(getByLabelText('not present')).toBeTruthy(/^((?!\.\.\.).)*$/),
  ).toThrowError()

  //all good replacing it with old value
  process.env.DEBUG_PRINT_LIMIT = originalDebugPrintLimit
})

test('getByText ignores script tags by default', () => {
  const {getAllByText} = render(
    '<script>Hello</script><div>Hello</div><style>.Hello{}</style>',
  )
  const divOnly = getAllByText(/hello/i)
  expect(divOnly).toHaveLength(1)
  expect(divOnly[0].tagName).toBe('DIV')
  const noScript = getAllByText(/hello/i, {ignore: 'script'})
  expect(noScript[0].tagName).toBe('DIV')
  expect(noScript[1].tagName).toBe('STYLE')
  expect(noScript).toHaveLength(2)
  expect(getAllByText(/hello/i, {ignore: false})).toHaveLength(3)
})

test('get/query input element by current value', () => {
  const {getByDisplayValue, queryByDisplayValue, getByTestId} =
    renderIntoDocument(`
    <div>
      <input placeholder="name" type="text" data-testid="name" value="Mercury" />
    </div>
  `)
  expect(getByDisplayValue('Mercury').placeholder).toEqual('name')
  expect(queryByDisplayValue('Mercury').placeholder).toEqual('name')

  getByTestId('name').value = 'Norris'
  expect(getByDisplayValue('Norris').placeholder).toEqual('name')
  expect(queryByDisplayValue('Norris').placeholder).toEqual('name')

  expect(queryByDisplayValue('Nor', {exact: false}).placeholder).toEqual('name')
})

test('get/query select element by current value', () => {
  const {getByDisplayValue, queryByDisplayValue, getByTestId} =
    renderIntoDocument(`
    <select id="state-select" data-testid="state">
      <option value="">State</option>
      <option value="AL">Alabama</option>
      <option selected value="AK" >Alaska</option>
      <option value="AZ">Arizona</option>
    </select>
  `)

  expect(getByDisplayValue('Alaska').id).toEqual('state-select')
  expect(queryByDisplayValue('Alaska').id).toEqual('state-select')

  getByTestId('state').value = 'AL'
  expect(getByDisplayValue('Alabama').id).toEqual('state-select')
  expect(queryByDisplayValue('Alabama').id).toEqual('state-select')
})

test('get/query textarea element by current value', () => {
  const {getByDisplayValue, queryByDisplayValue, getByTestId} =
    renderIntoDocument(`
    <textarea id="content-textarea" data-testid="content">
      Hello
    </textarea>
  `)

  expect(getByDisplayValue('Hello').id).toEqual('content-textarea')
  expect(queryByDisplayValue('Hello').id).toEqual('content-textarea')

  getByTestId('content').value = 'World'
  expect(getByDisplayValue('World').id).toEqual('content-textarea')
  expect(queryByDisplayValue('World').id).toEqual('content-textarea')
})

test('can get a textarea with children', () => {
  const {getByLabelText} = renderIntoDocument(`
    <label>Label<textarea>Value</textarea></label>
  `)
  getByLabelText('Label')
})

test('can get a select with options', () => {
  const {getByLabelText} = renderIntoDocument(`
    <label>
      Label
      <select>
        <option>Some</option>
        <option>Options</option>
      </select>
    </label>
  `)
  getByLabelText('Label')
})

test('can get an element with aria-labelledby when label has a child', () => {
  const {getByLabelText} = render(`
    <div>
      <label id='label-with-textarea'>
        First Label
        <textarea>Value</textarea>
      </label>
      <input aria-labelledby='label-with-textarea' id='1st-input'/>
      <label id='label-with-select'>
        Second Label
        <select><option value="1">one</option></select>
      </label>
      <input aria-labelledby='label-with-select' id='2nd-input'/>
    </div>
  `)
  expect(getByLabelText('First Label', {selector: 'input'}).id).toBe(
    '1st-input',
  )
  expect(getByLabelText('Second Label', {selector: 'input'}).id).toBe(
    '2nd-input',
  )
})
test('gets an element when there is an aria-labelledby a not found id', () => {
  const {getByLabelText} = render(`
    <div>
      <input aria-labelledby="not-existing-label"/>
      <label id="existing-label">Test</label>
      <input aria-labelledby="existing-label" id="input-id" />
    </div>
  `)
  expect(getByLabelText('Test').id).toBe('input-id')
})

test('return a proper error message when no label is found and there is an aria-labelledby a not found id', () => {
  const {getByLabelText} = render(
    '<input aria-labelledby="not-existing-label"/>',
  )

  expect(() => getByLabelText('LucyRicardo'))
    .toThrowErrorMatchingInlineSnapshot(`
    Unable to find a label with the text of: LucyRicardo

    Ignored nodes: comments, <script />, <style />
    <div>
      <input
        aria-labelledby="not-existing-label"
      />
    </div>
  `)
})

// https://github.com/testing-library/dom-testing-library/issues/723
it('gets form controls by label text on IE and other legacy browsers', () => {
  // Simulate lack of support for HTMLInputElement.prototype.labels
  jest
    .spyOn(HTMLInputElement.prototype, 'labels', 'get')
    .mockReturnValue(undefined)

  const {getByLabelText} = renderIntoDocument(`
    <label>
      Label text
      <input id="input-id" />
    </label>
  `)
  expect(getByLabelText('Label text').id).toBe('input-id')
})

// https://github.com/testing-library/dom-testing-library/issues/787
it(`get the output element by it's label`, () => {
  const {getByLabelText, rerender} = renderIntoDocument(`
    <label>foo
      <output>bar</output>
    </label>
  `)
  expect(getByLabelText('foo')).toBeInTheDocument()

  rerender(`
    <label>
      <small>foo</small>
      <output>bar</output>
    </label>
  `)

  expect(getByLabelText('foo')).toBeInTheDocument()
})

// https://github.com/testing-library/dom-testing-library/issues/343#issuecomment-555385756
it(`should get element by it's label when there are elements with same text`, () => {
  const {getByLabelText} = renderIntoDocument(`
    <label>test 1
      <textarea>test</textarea>
    </label>
  `)
  expect(getByLabelText('test 1')).toBeInTheDocument()
})

// TODO: undesired behavior. It should ignore the same element: https://github.com/testing-library/dom-testing-library/pull/907#pullrequestreview-678736288
test('ByText error message ignores not the same elements as configured in `ignore`', () => {
  const {getByText} = renderIntoDocument(`
    <style>
      .css-selector {
        color: red;
      }
    </style>
    <div class="css-selector"></div>
  `)

  expect(() =>
    getByText('.css-selector', {selector: 'style', ignore: 'script'}),
  ).toThrowErrorMatchingInlineSnapshot(`
    Unable to find an element with the text: .css-selector. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

    Ignored nodes: comments, <script />, <style />
    <body>
      
        
      
        
      <div
        class="css-selector"
      />
      
      
    </body>
  `)
})

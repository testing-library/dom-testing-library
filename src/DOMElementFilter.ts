/**
 * Source: https://github.com/facebook/jest/blob/e7bb6a1e26ffab90611b2593912df15b69315611/packages/pretty-format/src/plugins/DOMElement.ts
 */
/* eslint-disable -- trying to stay as close to the original as possible */
/* istanbul ignore file */
import type {Config, NewPlugin, Printer, Refs} from 'pretty-format'

function escapeHTML(str: string): string {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
// Return empty string if keys is empty.
const printProps = (
  keys: Array<string>,
  props: Record<string, unknown>,
  config: Config,
  indentation: string,
  depth: number,
  refs: Refs,
  printer: Printer,
): string => {
  const indentationNext = indentation + config.indent
  const colors = config.colors
  return keys
    .map(key => {
      const value = props[key]
      let printed = printer(value, config, indentationNext, depth, refs)

      if (typeof value !== 'string') {
        if (printed.indexOf('\n') !== -1) {
          printed =
            config.spacingOuter +
            indentationNext +
            printed +
            config.spacingOuter +
            indentation
        }
        printed = '{' + printed + '}'
      }

      return (
        config.spacingInner +
        indentation +
        colors.prop.open +
        key +
        colors.prop.close +
        '=' +
        colors.value.open +
        printed +
        colors.value.close
      )
    })
    .join('')
}

// https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType#node_type_constants
const NodeTypeTextNode = 3

// Return empty string if children is empty.
const printChildren = (
  children: Array<unknown>,
  config: Config,
  indentation: string,
  depth: number,
  refs: Refs,
  printer: Printer,
): string =>
  children
    .map(child => {
      const printedChild =
        typeof child === 'string'
          ? printText(child, config)
          : printer(child, config, indentation, depth, refs)

      if (
        printedChild === '' &&
        typeof child === 'object' &&
        child !== null &&
        (child as Node).nodeType !== NodeTypeTextNode
      ) {
        // A plugin serialized this Node to '' meaning we should ignore it.
        return ''
      }
      return config.spacingOuter + indentation + printedChild
    })
    .join('')

const printText = (text: string, config: Config): string => {
  const contentColor = config.colors.content
  return contentColor.open + escapeHTML(text) + contentColor.close
}

const printComment = (comment: string, config: Config): string => {
  const commentColor = config.colors.comment
  return (
    commentColor.open +
    '<!--' +
    escapeHTML(comment) +
    '-->' +
    commentColor.close
  )
}

// Separate the functions to format props, children, and element,
// so a plugin could override a particular function, if needed.
// Too bad, so sad: the traditional (but unnecessary) space
// in a self-closing tagColor requires a second test of printedProps.
const printElement = (
  type: string,
  printedProps: string,
  printedChildren: string,
  config: Config,
  indentation: string,
): string => {
  const tagColor = config.colors.tag
  return (
    tagColor.open +
    '<' +
    type +
    (printedProps &&
      tagColor.close +
        printedProps +
        config.spacingOuter +
        indentation +
        tagColor.open) +
    (printedChildren
      ? '>' +
        tagColor.close +
        printedChildren +
        config.spacingOuter +
        indentation +
        tagColor.open +
        '</' +
        type
      : (printedProps && !config.min ? '' : ' ') + '/') +
    '>' +
    tagColor.close
  )
}

const printElementAsLeaf = (type: string, config: Config): string => {
  const tagColor = config.colors.tag
  return (
    tagColor.open +
    '<' +
    type +
    tagColor.close +
    ' …' +
    tagColor.open +
    ' />' +
    tagColor.close
  )
}

const ELEMENT_NODE = 1
const TEXT_NODE = 3
const COMMENT_NODE = 8
const FRAGMENT_NODE = 11

const ELEMENT_REGEXP = /^((HTML|SVG)\w*)?Element$/

const isCustomElement = (val: any) => {
  const {tagName} = val
  return Boolean(
    (typeof tagName === 'string' && tagName.includes('-')) ||
      (typeof val.hasAttribute === 'function' && val.hasAttribute('is')),
  )
}

const testNode = (val: any) => {
  const constructorName = val.constructor.name

  const {nodeType} = val

  return (
    (nodeType === ELEMENT_NODE &&
      (ELEMENT_REGEXP.test(constructorName) || isCustomElement(val))) ||
    (nodeType === TEXT_NODE && constructorName === 'Text') ||
    (nodeType === COMMENT_NODE && constructorName === 'Comment') ||
    (nodeType === FRAGMENT_NODE && constructorName === 'DocumentFragment')
  )
}

export const test: NewPlugin['test'] = (val: any) =>
  (val?.constructor?.name || isCustomElement(val)) && testNode(val)

type HandledType = Element | Text | Comment | DocumentFragment

function nodeIsText(node: HandledType): node is Text {
  return node.nodeType === TEXT_NODE
}

function nodeIsComment(node: HandledType): node is Comment {
  return node.nodeType === COMMENT_NODE
}

function nodeIsFragment(node: HandledType): node is DocumentFragment {
  return node.nodeType === FRAGMENT_NODE
}

export default function createDOMElementFilter(
  filterNode: (node: Node) => boolean,
): NewPlugin {
  return {
    test: (val: any) =>
      (val?.constructor?.name || isCustomElement(val)) && testNode(val),
    serialize: (
      node: HandledType,
      config: Config,
      indentation: string,
      depth: number,
      refs: Refs,
      printer: Printer,
    ) => {
      if (nodeIsText(node)) {
        return printText(node.data, config)
      }

      if (nodeIsComment(node)) {
        return printComment(node.data, config)
      }

      const type = nodeIsFragment(node)
        ? `DocumentFragment`
        : node.tagName.toLowerCase()

      if (++depth > config.maxDepth) {
        return printElementAsLeaf(type, config)
      }

      return printElement(
        type,
        printProps(
          nodeIsFragment(node)
            ? []
            : Array.from(node.attributes)
                .map(attr => attr.name)
                .sort(),
          nodeIsFragment(node)
            ? {}
            : Array.from(node.attributes).reduce<Record<string, string>>(
                (props, attribute) => {
                  props[attribute.name] = attribute.value
                  return props
                },
                {},
              ),
          config,
          indentation + config.indent,
          depth,
          refs,
          printer,
        ),
        printChildren(
          Array.prototype.slice
            .call(node.childNodes || node.children)
            .filter(filterNode),
          config,
          indentation + config.indent,
          depth,
          refs,
          printer,
        ),
        config,
        indentation,
      )
    },
  }
}

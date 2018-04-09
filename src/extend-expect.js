import extensions from './jest-extensions'

const {
  toBeInTheDOM,
  toHaveTextContent,
  toHaveAttribute,
  toHaveClass,
} = extensions
expect.extend({toBeInTheDOM, toHaveTextContent, toHaveAttribute, toHaveClass})

const path = require('path')
const baseConfig = require('kcd-scripts/jest')

module.exports = {
  ...baseConfig,
  rootDir: path.join(__dirname, '..'),
  displayName: 'dom',
  testEnvironment: 'jest-environment-jsdom',
}

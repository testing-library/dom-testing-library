const path = require('path')
const baseConfig = require('kcd-scripts/jest')

module.exports = {
  ...baseConfig,
  rootDir: path.join(__dirname, '..'),
  displayName: 'node',
  testEnvironment: 'jest-environment-node',
  testMatch: ['**/__node_tests__/**.js'],
}

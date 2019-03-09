const baseConfig = require('kcd-scripts/jest')

module.exports = {
  ...baseConfig,
  testEnvironment: 'jest-environment-jsdom',
}

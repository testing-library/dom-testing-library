const path = require('path')
const baseConfig = require('kcd-scripts/jest')

module.exports = {
  ...baseConfig,
  rootDir: path.join(__dirname, '..'),
  displayName: 'node',
  testEnvironment: 'jest-environment-node',
  coveragePathIgnorePatterns: [
    ...baseConfig.coveragePathIgnorePatterns,
    '/__tests__/',
    '/__node_tests__/',
  ],
  transformIgnorePatterns: ['node_modules/(?!(query-selector-shadow-dom)/)'],
  testMatch: ['**/__node_tests__/**.js'],
}

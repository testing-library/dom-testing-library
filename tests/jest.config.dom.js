const path = require('path')
const baseConfig = require('kcd-scripts/jest')

module.exports = {
  ...baseConfig,
  rootDir: path.join(__dirname, '..'),
  displayName: 'dom',
  coveragePathIgnorePatterns: [
    ...baseConfig.coveragePathIgnorePatterns,
    '/__tests__/',
    '/__node_tests__/',
  ],
  testEnvironment: 'jest-environment-jsdom',
}

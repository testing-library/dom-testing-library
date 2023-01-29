const path = require('path')
const {
  // global config options that would trigger warnings in project configs
  collectCoverageFrom,
  watchPlugins,
  ...baseConfig
} = require('kcd-scripts/jest')

const projectConfig = {
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

module.exports = projectConfig

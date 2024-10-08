const packageJson = require('./package.json')
const path = require('path')

module.exports = {
  globals: {
    __DEV__: false,
    __MAC__: false,
    __WIN__: false,
    __LIN__: false,
    __JEST__: true,
    __MAIN__: true,
    __TEST_TEMP_DIR__: path.join(__dirname, '.test-temp'),
    __INT_TEST__: false,
    __APP_VERSION__: JSON.stringify(packageJson.version),
    __APP_NAME__: JSON.stringify(packageJson.name),
    __MENU2__: true,
  },
  roots: ['<rootDir>/src/'],
  transform: {
    '.(ts|tsx)': 'ts-jest',
  },
  testRegex: '(\\.(test))\\.(js|ts|tsx)$',
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/__mocks__/styleMock.js',
    '^electron$': '<rootDir>/__mocks__/electron.js',
    '^@electron/remote$': '<rootDir>/__mocks__/electron.js',
  },
  coverageDirectory: '<rootDir>/coverage~~',
  collectCoverageFrom: ['app/**/*.{ts,tsx,js}'],
}

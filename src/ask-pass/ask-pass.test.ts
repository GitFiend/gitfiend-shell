import {execSync} from 'child_process'
import {join} from 'path'
import {existsSync} from 'fs'
import os from 'os'

xdescribe('ask-pass javascript version', () => {
  const pathToAskPassSh = join(
    __dirname,
    '..',
    '..',
    'resources',
    'scripts',
    'ask-pass.sh'
  )

  // NOTE: The webpack build needs to be run before this will work.
  const pathToAskPassJs = join(__dirname, '..', '..', 'resource', 'dist', 'ask-pass.js')

  test('ask-pass paths exist', () => {
    expect(existsSync(pathToAskPassSh)).toBe(true)
    expect(existsSync(pathToAskPassJs)).toBe(true)
  })

  test('run ask-pass and request username', () => {
    const result = execSync(`${pathToAskPassSh} Username`, {
      env: {
        GITFIEND_PATH: 'node', // Just use node instead of app with ELECTRON_RUN_AS_NODE flag.
        GITFIEND_ASK_PASS_JS: pathToAskPassJs,
        GITFIEND_USERNAME: 'username',
        GITFIEND_PASSWORD: 'password',
      },
      encoding: 'utf8',
    })

    expect(result).toBe('username')
  })

  test('run ask-pass and request password', () => {
    const result = execSync(`${pathToAskPassSh} Password`, {
      env: {
        GITFIEND_PATH: 'node', // Just use node instead of app with ELECTRON_RUN_AS_NODE flag.
        GITFIEND_ASK_PASS_JS: pathToAskPassJs,
        GITFIEND_USERNAME: 'username',
        GITFIEND_PASSWORD: 'password',
      },
      encoding: 'utf8',
    })

    expect(result).toBe('password')
  })
})

describe('ask-pass rust version', () => {
  beforeAll(() => {
    execSync('cargo build', {cwd: __dirname})
  })

  const pathToBinary = join(
    __dirname,
    'target',
    'debug',
    `ask-pass${os.platform() === 'win32' ? '.exe' : ''}`
  )

  test('paths exist', () => {
    expect(existsSync(pathToBinary)).toBe(true)
  })

  test('run ask-pass and request username', () => {
    const result = execSync(`${pathToBinary} Username`, {
      env: {
        GITFIEND_USERNAME: 'username',
        GITFIEND_PASSWORD: 'password',
      },
      encoding: 'utf8',
    })

    expect(result).toBe('username')
  })

  test('run ask-pass and request username', () => {
    const result = execSync(`${pathToBinary} Password`, {
      env: {
        GITFIEND_USERNAME: 'username',
        GITFIEND_PASSWORD: 'password',
      },
      encoding: 'utf8',
    })

    expect(result).toBe('password')
  })
})

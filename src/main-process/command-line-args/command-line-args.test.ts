import {parseRepoDirFromArgs} from './command-line-args'
import path from 'path'

describe('parseRepoDirFromArgs', () => {
  const a = ['/Applications/GitFiend.app/Contents/MacOS/GitFiend']

  it(`${a}`, () => {
    expect(parseRepoDirFromArgs(a)).toEqual(null)
  })

  const b = [
    '/Applications/GitFiend.app/Contents/MacOS/GitFiend',
    '/Users/tobysuggate/Repos/git-fiend'
  ]

  it(`${b}`, () => {
    expect(path.resolve(parseRepoDirFromArgs(b)!)).toEqual(
      path.resolve('/Users/tobysuggate/Repos/git-fiend')
    )
  })

  const c = [
    '/Users/tobysuggate/Repos/git-fiend/node_modules/electron/dist/Electron.app/Contents/MacOS/Electron',
    'output-code/main.js'
  ]

  it(`${c}`, () => {
    expect(parseRepoDirFromArgs(c)).toEqual(null)
  })

  const d = [
    '/Users/tobysuggate/Repos/git-fiend/node_modules/electron/dist/Electron.app/Contents/MacOS/Electron',
    'output-code/main.js',
    '/Users/tobysuggate/Repos/git-fiend'
  ]

  it(`${d}`, () => {
    expect(path.resolve(parseRepoDirFromArgs(d)!)).toEqual(
      path.resolve('/Users/tobysuggate/Repos/git-fiend')
    )
  })
})

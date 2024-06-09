import path from 'path'
import {existsSync} from 'fs'
import {getCwd} from '../util'

interface AppArgs {
  repoPath: string | null
}

export function readAppArgs(): AppArgs {
  const {argv} = process

  const p = parseRepoDirFromArgs(argv)

  if (p === null) return {repoPath: null}

  return {
    repoPath: tryResolvePath(p),
  }
}

export function parseRepoDirFromArgs(argv: string[]): string | null {
  let args: string[]

  if (argv[1] !== undefined && argv[1].endsWith('.js')) args = argv.slice(2)
  else args = argv.slice(1)

  if (args.length === 0) return null

  const p = args.find(a => {
    return !a.startsWith('-') && validPathFormat(a)
  })

  if (p !== undefined) return p
  return null
}

export function validPathFormat(str: string): boolean {
  return path.basename(path.resolve(str)) !== str
}

const cwd = getCwd()

function tryResolvePath(p: string): string | null {
  // I don't know why this is required.
  p = p.replace('"', '')

  if (p === '.') return path.resolve(cwd)

  if (path.isAbsolute(p) && existsSync(p)) return p

  const p2 = path.join(cwd, p)

  if (existsSync(p2)) return path.resolve(p2)

  const p3 = path.resolve(p)

  if (existsSync(p3)) return p3

  return null
}

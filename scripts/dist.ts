import {runAndPrint} from './util'
import {join, resolve} from 'path'
import fs, {existsSync} from 'fs'
import {removePathSync} from '../src/main-process/util'
import {ensureDirSync} from '../src/lib/node-util'
import {platform} from 'os'

const option = {
  platform: ['win', 'mac', 'linux'],
  arch: ['x86', 'arm'],
  linBundle: ['appImage', 'deb', 'rpm'],
  winBundle: ['appx', 'nsis'],
} as const

type RustTarget =
  | 'aarch64-apple-darwin'
  | 'x86_64-apple-darwin'
  | 'x86_64-unknown-linux-musl'
  | 'aarch64-unknown-linux-musl'
  | 'x86_64-pc-windows-msvc'
  | 'aarch64-pc-windows-msvc'

async function run() {
  const config = readArgs(process.argv.slice(2))

  let useCross = false
  if (detectPlatform() !== config[0]) {
    useCross = true
  }

  const target = pickTarget(config)

  removePathSync(resolve('resources', 'dist-ui-dev'))
  const distDir = resolve('resources', 'dist')
  removePathSync(distDir)
  ensureDirSync(distDir)

  const exe = config[0] === 'win' ? '.exe' : ''
  const askPassDir = resolve(__dirname, '..', 'src', 'ask-pass')
  await cargoBuild(askPassDir, target, useCross)
  copyFile(
    join(askPassDir, 'target', target, 'release'),
    join(distDir, 'ask-pass'),
    'ask-pass' + exe,
  )

  const coreDir = resolve(__dirname, '..', '..', 'gitfiend-core')
  await cargoBuild(coreDir, target, useCross)
  copyFile(
    join(coreDir, 'target', target, 'release'),
    resolve('resources', 'dist', 'core'),
    'gitfiend-core' + exe,
  )

  await runAndPrint({command: 'webpack', dir: process.cwd(), args: ['--mode=production']})
    .promise

  const args = [
    '--config',
    pickBuilderConfig(config),
    config[1] === 'x86' ? '--x64' : '--arm64',
  ]
  const t = calcElectronTarget(config)
  if (t) {
    args.push(...t)
  }

  await runAndPrint({
    command: 'electron-builder',
    dir: process.cwd(),
    args,
  }).promise
}

type Config =
  | ['win', 'x86' | 'arm', 'appx' | 'nsis']
  | ['mac', 'x86' | 'arm']
  | ['linux', 'x86' | 'arm', 'deb' | 'rpm' | 'appImage']

function readArgs(args: string[]): Config {
  const platform = findOption(args, option.platform)
  const arch = findOption(args, option.arch)

  if (!platform) {
    fatal(`Missing platform. One of `, option.platform, 'is required')
  }

  if (!arch) {
    fatal(`Missing architecture. One of `, option.arch, 'is required')
  }

  if (platform === 'win') {
    const bundle = findOption(args, option.winBundle)
    if (!bundle) {
      fatal('Missing bundle type. One of ', option.winBundle, 'is required')
    }
    return [platform, arch, bundle]
  }

  if (platform === 'mac') {
    return [platform, arch]
  }

  const bundle = findOption(args, option.linBundle)

  if (!bundle) {
    fatal('Missing bundle type. One of ', option.linBundle, 'is required')
  }
  return [platform, arch, bundle]
}

function pickTarget(config: Config): RustTarget {
  const [platorm, arch] = config

  switch (platorm) {
    case 'win':
      if (arch === 'x86') return 'x86_64-pc-windows-msvc'
      return 'aarch64-pc-windows-msvc'
    case 'mac':
      if (arch === 'x86') return 'x86_64-apple-darwin'
      return 'aarch64-apple-darwin'
    case 'linux':
      if (arch === 'x86') return 'x86_64-unknown-linux-musl'
      return 'aarch64-unknown-linux-musl'
  }
}

function calcElectronTarget(config: Config): string[] | null {
  const [platform, _, target] = config
  if (platform === 'mac') return null

  return [`--${platform}`, target]
}

function pickBuilderConfig([platform, _, bundle]: Config) {
  const configDir = resolve('..', 'config')
  const configExists = existsSync(configDir)

  const defaultConfig = resolve('builder', 'builder.config.js')
  if (!configExists) {
    return defaultConfig
  }

  switch (platform) {
    case 'win':
      if (bundle === 'appx') {
        return join(configDir, 'appx.js')
      }
      return defaultConfig
    case 'mac':
      return join(configDir, 'mac.js')
    case 'linux':
      return defaultConfig
  }
}

async function cargoBuild(
  dir: string,
  target: RustTarget,
  useCross: boolean,
): Promise<number | null> {
  const args = ['build', '--release', '--target', target]

  const res = await runAndPrint({
    command: useCross ? 'cross' : 'cargo',
    dir,
    args,
  }).promise

  if (res) {
    process.exit(res)
  }

  return res
}

function detectPlatform(): 'win' | 'mac' | 'linux' {
  const p = platform()
  switch (p) {
    case 'darwin':
      return 'mac'
    case 'win32':
      return 'win'
    case 'linux':
      return 'linux'
    default:
      console.log(`Platform ${p} doesn't have any implementations yet.`)
      process.exit(1)
  }
}

function findOption<T>(args: string[], options: readonly T[]): T | null {
  for (const a of args) {
    if (options.includes(a as T)) {
      return a as T
    }
  }
  return null
}

function copyFile(fileDir: string, dest: string, fileName: string) {
  fs.mkdirSync(dest)
  fs.copyFileSync(join(fileDir, fileName), join(dest, fileName))
}

function fatal(...messageParts: any): never {
  console.error(...messageParts)
  process.exit()
}

run().catch(console.error)

const option = {
  platform: ['win', 'mac', 'linux'],
  arch: ['x86', 'arm'],
  linBundle: ['appImage', 'deb', 'rpm'],
  winBundle: ['appx', 'nsis'],
} as const

async function run() {
  const config = readArgs(process.argv.slice(2))
  console.log(config)
}

type Config =
  | ['win', 'x86', 'appx' | 'nsis']
  | ['mac', 'x86' | 'arm']
  | ['linux', 'x86' | 'arm', 'deb' | 'rpm' | 'appImage']

function readArgs(args: string[]): Config {
  const platform = findOption(args, option.platform)
  const arch = findOption(args, option.arch)

  if (!platform) {
    fatal(`Missing platform. One of `, option.platform, 'is required')
  }

  if (platform === 'win') {
    if (arch === 'arm') {
      fatal(`Arm architecture on Windows hasn't been implement yet`)
    }

    const bundle = findOption(args, option.winBundle)
    if (!bundle) {
      fatal('Missing bundle type. One of ', option.winBundle, 'is required')
    }
    return [platform, 'x86', bundle]
  }

  if (!arch) {
    fatal(`Missing architecture. One of `, option.arch, 'is required')
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

function findOption<T>(args: string[], options: readonly T[]): T | null {
  for (const a of args) {
    if (options.includes(a as T)) {
      return a as T
    }
  }
  return null
}

function fatal(...messageParts: any): never {
  console.error(...messageParts)
  process.exit()
}

run().catch(console.error)

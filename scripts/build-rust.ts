import {arch, platform} from 'os'
import {runAndPrint} from './util'

export function buildRust(dir: string): Promise<number | null> {
  const args = ['build', '--release']

  if (platform() === 'linux') {
    if (arch() === 'arm64') {
      args.push('--target', 'aarch64-unknown-linux-musl')
    } else {
      args.push('--target', 'x86_64-unknown-linux-musl')
    }
  }

  return runAndPrint({
    command: 'cargo',
    dir,
    args,
  }).promise
}

export function copyToDist() {}

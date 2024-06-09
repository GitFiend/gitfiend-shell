import {arch, platform} from 'os'
import {runAndPrint} from './run-and-print'

export async function buildRust(dir: string) {
  const args = ['build', '--release']

  if (platform() === 'linux') {
    if (arch() === 'arm64') {
      args.push('--target', 'aarch64-unknown-linux-musl')
    } else {
      args.push('--target', 'x86_64-unknown-linux-musl')
    }
  }

  await runAndPrint({
    command: 'cargo',
    dir,
    args,
  })
}

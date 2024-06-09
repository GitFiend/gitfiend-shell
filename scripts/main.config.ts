import {BuildEnvironment, commonConfig, WebpackArgv, WebpackEnv} from './shared.config'
import {Configuration} from 'webpack'
import path from 'path'
import {CopyFolderPlugin} from './copy-folder-plugin'
import {arch, platform} from 'os'

export function mainConfig(
  env: WebpackEnv,
  argv: WebpackArgv,
  devMode: boolean,
  buildEnvironment: BuildEnvironment,
  rootDir: string,
): Configuration {
  const c = commonConfig(env, argv, rootDir, {...buildEnvironment, __MAIN__: true})

  c.entry = {
    main: path.join(rootDir, 'src/main-process/main.ts'),
    // 'ask-pass': path.join(rootDir, 'src/ask-pass/ask-pass.ts'),
  }
  c.target = 'electron-main'

  c.plugins?.push(
    new CopyFolderPlugin({
      from:
        platform() === 'linux'
          ? path.resolve(
              '..',
              'gitfiend-core',
              'target',
              arch() === 'arm64'
                ? 'aarch64-unknown-linux-musl'
                : 'x86_64-unknown-linux-musl',
              'release',
            )
          : path.resolve('..', 'gitfiend-core', 'target', 'release'),
      to: path.resolve('resources', 'dist', 'core'),
      exclude: rustExclude,
    }),
    new CopyFolderPlugin({
      from:
        platform() === 'linux'
          ? path.resolve(
              'src',
              'ask-pass',
              'target',
              arch() === 'arm64'
                ? 'aarch64-unknown-linux-musl'
                : 'x86_64-unknown-linux-musl',
              'release',
            )
          : path.resolve('src', 'ask-pass', 'target', 'release'),
      to: path.resolve('resources', 'dist', 'ask-pass'),
      exclude: rustExclude,
    }),
  )

  return c
}

const rustExclude = [
  '.fingerprint',
  'build',
  'deps',
  'examples',
  'incremental',
  '.cargo-lock',
  'gitfiend-core.d',
]

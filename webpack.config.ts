/// <reference path="globals.d.ts" />
import {platform} from 'os'
import {Configuration, DefinePlugin} from 'webpack'
import {join, sep} from 'path'
import ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const packageJson = require('./package.json')

interface WebpackArgv {
  mode: 'development' | 'production'
  env: WebpackEnv
}

interface WebpackEnv {
  testInt?: 'true'
  devUI?: 'true'
}

function configs(env: WebpackEnv, argv: WebpackArgv): Configuration {
  const devMode = argv.mode === 'development'
  const testIntMode = env.testInt === 'true'
  const devUI = env.devUI === 'true'

  const outputDir = join(__dirname, 'resources', 'dist')
  // removePathSync(outputDir)
  // ensureDirSync(outputDir)
  // console.log(`Cleared ${outputDir}.`)

  return {
    entry: {
      main: join(__dirname, 'src/main-process/main.ts'),
    },
    target: 'electron-main',
    output: {
      path: outputDir,
      filename: '[name].js',
    },
    devtool: devMode ? 'eval-source-map' : undefined,
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    plugins: [
      new DefinePlugin({
        __DEV__: devMode,
        __MAC__: platform() === 'darwin',
        __WIN__: platform() === 'win32',
        __LIN__: platform() === 'linux',
        __TEST_TEMP_DIR__: JSON.stringify(join(__dirname, '.test-temp')),
        __APP_VERSION__: JSON.stringify(packageJson.version),
        __APP_NAME__: JSON.stringify(packageJson.name),
        __DEV_UI__: devUI,

        __JEST__: false,
        __INT_TEST__: testIntMode,

        __MAIN__: true,

        __PLATFORM__: JSON.stringify(platform()),
        __SEP__: JSON.stringify(sep),
      }),
      new ForkTsCheckerWebpackPlugin(),
      // new CopyFolderPlugin({
      //   from:
      //     platform() === 'linux'
      //       ? resolve(
      //           '..',
      //           'gitfiend-core',
      //           'target',
      //           arch() === 'arm64'
      //             ? 'aarch64-unknown-linux-musl'
      //             : 'x86_64-unknown-linux-musl',
      //           'release',
      //         )
      //       : resolve('..', 'gitfiend-core', 'target', 'release'),
      //   to: resolve('resources', 'dist', 'core'),
      //   exclude: rustExclude,
      // }),
      // new CopyFolderPlugin({
      //   from:
      //     platform() === 'linux'
      //       ? resolve(
      //           'src',
      //           'ask-pass',
      //           'target',
      //           arch() === 'arm64'
      //             ? 'aarch64-unknown-linux-musl'
      //             : 'x86_64-unknown-linux-musl',
      //           'release',
      //         )
      //       : resolve('src', 'ask-pass', 'target', 'release'),
      //   to: resolve('resources', 'dist', 'ask-pass'),
      //   exclude: rustExclude,
      // }),
    ],
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: 'esbuild-loader',
              options: {
                target: 'es2020',
                tsconfigRaw: require('./tsconfig.json'),
              },
            },
          ],
        },
      ],
    },
  }
}

// const rustExclude = [
//   '.fingerprint',
//   'build',
//   'deps',
//   'examples',
//   'incremental',
//   '.cargo-lock',
//   'gitfiend-core.d',
//   'ask-pass.d',
// ]

module.exports = configs

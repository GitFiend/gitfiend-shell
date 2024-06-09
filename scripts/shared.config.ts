import webpack, {Configuration} from 'webpack'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import {join} from 'path'

export interface WebpackArgv {
  mode: 'development' | 'production'
  env: WebpackEnv
}

export interface WebpackEnv {
  testInt?: 'true'
  macNative?: 'true'
  server?: 'true'
  tauri?: 'true'
}

export function commonConfig(
  env: WebpackEnv,
  argv: WebpackArgv,
  rootDir: string,
  buildEnvironment: BuildEnvironment,
): Configuration {
  const devMode = argv.mode === 'development'

  return {
    output: {
      path: join(rootDir, 'resources', 'dist'),
      filename: '[name].js',
    },
    stats: {
      entrypoints: false,
      colors: true,
      modules: false,
    },
    mode: argv.mode,
    devtool: devMode ? 'eval-source-map' : undefined,
    node: false,
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    plugins: [
      new webpack.DefinePlugin(buildEnvironment),
      new ForkTsCheckerWebpackPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'esbuild-loader',
              options: {
                target: 'es2020',
                tsconfigRaw: require('../tsconfig.json'),
              },
            },
            {loader: 'ifdef-loader', options: buildEnvironment},
          ],
        },
      ],
    },
    optimization: {
      minimizer: ['...'],
    },
  }
}

export interface BuildEnvironment extends Record<string, string | boolean> {
  __DEV__: boolean
  __MAC__: boolean
  __WIN__: boolean
  __LIN__: boolean
  __JEST__: boolean
  __INT_TEST__: boolean
  __MENU2__: boolean
  __APP_VERSION__: string
  __APP_NAME__: string
  __RENDERER__: boolean
  __MAIN__: boolean
  __FIEND_DEV__: boolean
  __MAC_NATIVE__: boolean
  __ELECTRON__: boolean
  __TAURI__: boolean
}

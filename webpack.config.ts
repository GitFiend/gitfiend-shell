/// <reference path="globals.d.ts" />
process.env.WEBPACK_RUNNING = 'true'

import {platform} from 'os'
import {Configuration} from 'webpack'
import {BuildEnvironment, WebpackArgv, WebpackEnv} from './scripts/shared.config'
import {mainConfig} from './scripts/main.config'
import {join, sep} from 'path'
import {removePathSync} from './src/main-process/util'
import {ensureDirSync} from './src/lib/node-util'

const packageJson = require('./package.json')

function configs(env: WebpackEnv, argv: WebpackArgv): Configuration[] | Configuration {
  const devMode = argv.mode === 'development'
  const testIntMode = !!(env && env.testInt === 'true')

  const outputDir = join(__dirname, 'resources', 'dist')
  removePathSync(outputDir)
  ensureDirSync(outputDir)
  console.log(`Cleared ${outputDir}.`)

  const browserOnly = env?.server === 'true'

  const buildEnvironment: BuildEnvironment = {
    __DEV__: devMode,
    __MAC__: platform() === 'darwin',
    __WIN__: platform() === 'win32',
    __LIN__: platform() === 'linux',
    __TEST_TEMP_DIR__: JSON.stringify(join(__dirname, '.test-temp')),
    __APP_VERSION__: JSON.stringify(packageJson.version),
    __APP_NAME__: JSON.stringify(packageJson.name),

    __JEST__: false,
    __INT_TEST__: testIntMode,
    __MENU2__: false, // || platform() !== 'darwin'
    __FIEND_DEV__: false,

    // Whether to use server to load files instead of file protocol.
    __USE_SERVER__: browserOnly,
    __BROWSER_ONLY__: false, // TODO: "tauri" just for now
    __ELECTRON__: true,

    // These are overridden depending on what js file they are.
    __RENDERER__: false,
    __MAIN__: false,
    __MAC_NATIVE__: false,
    __TAURI__: false,

    __PLATFORM__: JSON.stringify(platform()),
    __SEP__: JSON.stringify(sep),

    __RESOURCES_DIR__: JSON.stringify(join(__dirname, 'resources')),

    // We do this here so that Chrome dev tools shows the correct file name.
    // Putting it in an util file would obscure where it's called.
    TIME: `((id)=>{if (${devMode}) console.time(id);})`,
    TIME_END: `((id)=>{if (${devMode}) console.timeEnd(id);})`,
    LOG: `((...args)=>{if (${devMode}) console.log(...args);})`,
    PERF: `((name) => {if (${devMode} && typeof window !== 'undefined') {performance.mark(name + 'start')}})`,
    PERF_END: `((name) => {if (${devMode} && typeof window !== 'undefined') {performance.mark(name + 'end');performance.measure(name, name + 'start', name + 'end');}})`,
    some: `(value) => value != null`, // Terser doesn't seem to inline this, even though it should.
    // some: `null !=`,
  }

  return mainConfig(env, argv, devMode, buildEnvironment, __dirname)
}

module.exports = configs

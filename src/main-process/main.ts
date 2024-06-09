import {setupMainFunctionRpc} from '../rpc/main-functions'
import {app} from 'electron'
import {handleCommandLineHelp} from './command-line-help'
import {runCreateWindow} from './main-window'
import {setupTheming} from './theming'
import {startCore} from './core/start-core'

if (!app.requestSingleInstanceLock()) {
  app.quit()
}

handleCommandLineHelp()

app.commandLine.appendSwitch('js-flags', '--optimize_for_size')
// app.commandLine.appendSwitch('js-flags', '--expose_gc')
// if (__DEV__) app.commandLine.appendSwitch('disable-frame-rate-limit')

if (__DEV__) {
  runCreateWindow(29997)
} else {
  startCore()
    .then(runCreateWindow)
    .catch(e => console.log(e))
}

setupMainFunctionRpc()
setupTheming()

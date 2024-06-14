import type {MainFunctions} from './main-functions'
import {getRpcCaller} from './rpc-call'

export const Main = new Proxy(
  {},
  {
    get<N extends keyof MainFunctions>(_target: {}, prop: N) {
      return async (...args: Parameters<MainFunctions[N]>) => callInMain(prop, ...args)
    },
  },
) as MainFunctionsResult

type MainFunctionsResult = {
  [N in keyof MainFunctions]: (
    ...args: Parameters<MainFunctions[N]>
  ) => ReturnType<MainFunctions[N]> extends Promise<unknown>
    ? ReturnType<MainFunctions[N]>
    : Promise<ReturnType<MainFunctions[N]>>
}

const callInMain: <N extends keyof MainFunctions>(
  name: N,
  ...args: Parameters<MainFunctions[N]>
) => Promise<ReturnType<MainFunctions[N]>> = initCallInMain()

function initCallInMain<N extends keyof MainFunctions>() {
  if (__JEST__) {
    /// #if __JEST__
    const {mainFunctions} = require('./electron-rpc')

    return async (name: N, ...args: Parameters<MainFunctions[N]>) =>
      mainFunctions[name](...args)

    /// #endif
  }

  const {ipcRenderer} = require('electron')

  return getRpcCaller('call-in-main', ipcRenderer.send, ipcRenderer)
}

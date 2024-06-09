import {ipcMain} from 'electron'
import {RpcRequest, RpcResponse} from './rpc-shared'
import {mainFunctions} from './electron-rpc'

export type MainFunctions = typeof mainFunctions

export function setupMainFunctionRpc() {
  ipcMain.on('call-in-main', async (event, request: RpcRequest<any>) => {
    if (__DEV__) console.log(`call-in-main: ${request.functionName}`)

    const result = await mainFunctions[request.functionName as keyof MainFunctions](
      // @ts-ignore
      ...request.args,
    )

    const response: RpcResponse<any> = {
      result,
      callNum: request.callNum,
    }

    event.reply('call-in-main', response)
  })
}

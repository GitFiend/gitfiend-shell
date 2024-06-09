//
declare const __DEV__: boolean
declare const __FIEND_DEV__: boolean

declare const __MAC__: boolean
declare const __MAC_NATIVE__: boolean

declare const __WIN__: boolean

declare const __LIN__: boolean

declare const __JEST__: boolean
declare const __TEST_TEMP_DIR__: string

declare const __INT_TEST__: boolean

declare const __MENU2__: boolean

declare const __APP_VERSION__: string

declare const __APP_NAME__: string

declare const __RENDERER__: boolean
declare const __MAIN__: boolean

declare const __PLATFORM__: string
declare const __SEP__: string
// declare const __RESOURCES_DIR__: string

declare const TIME: (string) => void

// TODO: Might be nice to have a version that only prints if
//  something takes long than expected
declare const TIME_END: (string) => void
declare const LOG: (...args: any[]) => void

declare const PERF: (string) => void
declare const PERF_END: (string) => void

declare function some<T>(value: T | null | undefined): value is T

declare const __USE_SERVER__: boolean
declare const __BROWSER_ONLY__: boolean
declare const __ELECTRON__: boolean
declare const __TAURI__: boolean

declare namespace main {
  declare function send(channel: string, data?: any): void
  declare function on(channel: string, func?: any): void
}

declare namespace webkit {
  declare const messageHandlers = {
    shell: {
      postMessage(_message: any) {},
    },
  }
}

declare function messageFromShell(data: any): void
declare function responseFromShell(data: any): void

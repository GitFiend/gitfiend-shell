export function RENDERER_ONLY() {
  /// #if __DEV__
  try {
    if (process.env.WEBPACK_RUNNING === 'true') return
  } catch {}

  if (!__DEV__) return

  if (__MAIN__) {
    throw `${__filename} being used outside renderer`
  }
  /// #endif
}

export function NOT_IN_RENDERER(fileName: string) {
  /// #if __DEV__

  try {
    if (process.env.WEBPACK_RUNNING === 'true') return
  } catch {}

  if (!__DEV__) return

  if (__INT_TEST__) return

  if (__RENDERER__) {
    throw `${fileName} being used in renderer`
  }
  /// #endif
}

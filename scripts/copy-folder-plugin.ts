import {Compiler} from 'webpack'
import path from 'path'
import {existsSync} from 'fs'
import {copyFolderSync, removePathSync} from '../src/main-process/util'

export interface CopyFolderPluginOptions {
  from: string
  to: string
  exclude?: string[]
  disable?: boolean
}

// NOTE: Doesn't copy in development mode.
export class CopyFolderPlugin {
  constructor(private options: CopyFolderPluginOptions) {}

  apply(compiler: Compiler) {
    const {from, to, disable} = this.options

    if (compiler.options.mode === 'development' || disable === true) return

    compiler.hooks.afterEmit.tap('CopyFolderPlugin', () => {
      copyFolderSync(from, to)
      console.log('Copying ', {from, to})

      if (this.options.exclude) {
        for (const item of this.options.exclude) {
          const itemPath = path.join(this.options.to, item)

          if (existsSync(itemPath)) removePathSync(itemPath)
        }
      }
    })
  }
}

import path from 'path'
import {paths} from '../../paths'
import {spawn} from 'child_process'
import {existsSync} from 'fs'
import {app} from 'electron'
import {parsePort} from './parse-port'

export function startCore(): Promise<number | null> {
  return new Promise<number | null>(resolve => {
    const process = spawn(getCorePath(), {detached: false})

    let havePort = false

    process.stdout.on('data', data => {
      const text: string = data.toString()

      if (!havePort) {
        // Check each line of text for the port if we don't yet have it.
        const port = parsePort(text)

        if (port) {
          havePort = true
          resolve(port)
        } else {
          console.error(`Expected PORT, got ${text}`)
          resolve(null)
        }
      }

      console.log(text)
    })
    process.stderr.on('data', data => {
      console.log(data.toString())
    })
    process.on('error', e => {
      console.log(e)
    })
    process.on('close', code => {
      console.log(code)
    })

    app.on('will-quit', () => {
      console.log('will quit')
      process.kill()
    })
  })
}

function getCorePath(): string {
  const fileName = `gitfiend-core${__WIN__ ? '.exe' : ''}`

  const corePath = __DEV__
    ? path.resolve('..', 'gitfiend-core', 'target', 'release', fileName)
    : path.join(paths.unpacked, 'resources', 'dist', 'core', fileName)

  console.log(corePath, existsSync(corePath))

  return corePath
}

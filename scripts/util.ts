import {spawn} from 'child_process'
import fs from 'fs'
import {_debounce} from '../src/lib/general-functions'

interface Options {
  command: string
  args: string[]
  dir: string
}

export function runAndPrint({command, dir, args}: Options): {
  promise: Promise<number | null>
  kill: () => void
} {
  let kill = () => {}

  const p = new Promise<number | null>(resolve => {
    console.log(`${command} ${args.join(' ')}`)

    const proc = spawn(command, args, {cwd: dir, stdio: 'inherit'})

    kill = () => {
      proc.kill(1)
    }

    proc.on('exit', code => {
      resolve(code)
    })
  })

  return {promise: p, kill}
}

// Runs the provided command and restarts if there are changes in watchDir.
export function watch(options: {
  command: string
  args: string[]
  commandDir: string
  watchDir: string
  // Whether to run the command only after the watchDir has changed
  waitForChange?: boolean
}) {
  const {command, commandDir, watchDir, args, waitForChange = false} = options

  let run = waitForChange
    ? {
        kill: () => {},
        promise: Promise.resolve(),
      }
    : runAndPrint({
        command,
        dir: commandDir,
        args,
      })

  const w = fs.watch(watchDir, {recursive: true})
  w.addListener(
    'change',
    _debounce(async (_event: string, _filename: string) => {
      run.kill()
      await run.promise

      run = runAndPrint({
        command,
        dir: commandDir,
        args,
      })
    }, 1000),
  )
}

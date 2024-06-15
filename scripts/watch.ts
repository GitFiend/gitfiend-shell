import fs from 'fs'
import {join, resolve} from 'path'
import {runAndPrint} from './run-and-print'
import {_debounce} from '../src/lib/general-functions'

function watchAll() {
  runAndPrint({
    command: 'npm',
    args: ['run', 'watchShell'],
    dir: resolve(),
  })

  const coreDir = resolve('..', 'gitfiend-core')
  watch({
    command: 'cargo',
    args: ['run'],
    watchDir: join(coreDir, 'src'),
    commandDir: coreDir,
  })

  // watch({
  //   command: 'npm',
  //   args: ['run', 'start'],
  //   watchDir: resolve('resources'),
  //   commandDir: resolve(),
  // })
}
watchAll()

// Runs the provided command and restarts if there are changes in watchDir.
function watch(options: {
  command: string
  args: string[]
  commandDir: string
  watchDir: string
}) {
  const {command, commandDir, watchDir, args} = options

  let run = runAndPrint({
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

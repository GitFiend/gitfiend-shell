import {join, resolve} from 'path'
import {runAndPrint, watch} from './util'

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
  //   waitForChange: true,
  // })
}

watchAll()

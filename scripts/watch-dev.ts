import {runAndPrint, watch} from './util'
import {join, resolve} from 'path'

function watchAll() {
  runAndPrint({
    command: 'npm',
    args: ['run', 'watchShellDev'],
    dir: resolve(),
  })

  const coreDir = resolve('..', 'gitfiend-core')
  watch({
    command: 'cargo',
    args: ['run'],
    watchDir: join(coreDir, 'src'),
    commandDir: coreDir,
  })
}

watchAll()

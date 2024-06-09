import {resolve} from 'path'
import {existsSync, cpSync, rmSync} from 'fs'
import {runAndPrint} from './run-and-print'

async function run() {
  const gitfiendDir = process.cwd()
  console.assert(gitfiendDir.endsWith('git-fiend'))

  const gitfiendCoreDir = resolve(gitfiendDir, '..', 'gitfiend-core')
  console.assert(existsSync(gitfiendCoreDir))
  const serverTypesDir = resolve(gitfiendCoreDir, 'server', 'bindings')
  const coreTypesDir = resolve(gitfiendCoreDir, 'core_lib', 'bindings')

  // Delete them first to get rid of stale types.
  rmSync(serverTypesDir, {recursive: true})
  rmSync(coreTypesDir, {recursive: true})

  await runAndPrint({
    command: 'cargo',
    args: ['test'],
    dir: gitfiendCoreDir,
  })

  const targetDir = resolve(gitfiendDir, 'core-types')
  rmSync(targetDir, {recursive: true})

  cpSync(serverTypesDir, targetDir, {recursive: true})
  cpSync(coreTypesDir, targetDir, {recursive: true})
}

run().catch(console.error)

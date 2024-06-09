import {resolve} from 'path'
import {buildRust} from './build-rust'

async function build() {
  await buildRust(resolve(__dirname, '..', 'src', 'ask-pass'))
}

build().catch(console.error)

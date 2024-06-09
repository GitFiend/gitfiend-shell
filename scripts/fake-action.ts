import {sleep} from '../src/lib/shared-util'

const stepDuration = 100

// All clone progress seems to be written to stderr.
async function fakeAction() {
  console.error('beginning fake clone...')

  for (let i = 0; i < 100; i += 2) {
    await sleep(stepDuration)
    // console.error(`\r cloning ${i}/100`)

    // Replace prev line, no line ending.
    process.stderr.write(`\r cloning ${i}/100`)
  }

  console.log('omg done!')
}

fakeAction().catch(e => console.log(e))

import path from 'path'
import {existsSync} from 'fs'
import {removePathSync} from '../../main-process/util'
import {ensureDirSync} from '../../lib/node-util'

describe('ensureDirSync', () => {
  const p = path.join(process.cwd(), 'hey', 'there')
  const p2 = path.join(process.cwd(), 'hey')

  it(p, () => {
    ensureDirSync(p)

    expect(existsSync(p)).toBe(true)

    removePathSync(p2)

    expect(existsSync(p2)).toBe(false)
  })
})

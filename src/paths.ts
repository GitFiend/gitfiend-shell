/// <reference path="../globals.d.ts" />

import path from 'path'
import {_mapO} from './lib/general-functions'
import {existsSync} from 'fs'

// Relative to the html file. This isn't the same in __INT_TEST__
const root = path.join(__dirname, '..')

const unpacked = path.join(root, '..', '..', 'app.asar.unpacked')

export const paths = {
  root,
  unpacked,
}

if (__DEV__) {
  _mapO(paths, (p, key) => {
    if (!existsSync(p) && key !== 'unpacked')
      console.error(`"${p}" doesn't exist! Key: ${key}`)
  })
}

import fs from 'node:fs'
import https from 'node:https'
import path from 'node:path'
import zlib from 'node:zlib'
import * as tar from 'tar'

const db = 'GeoLite2-City'

let url = `https://raw.githubusercontent.com/GitSquared/node-geolite2-redist/master/redist/${db}.tar.gz`

const dest = path.resolve(__dirname, '../geo')

if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest)
}

const download = (url: string) => new Promise<tar.Parser>(resolve => {
  https.get(url, res => {
    resolve(res.pipe(zlib.createGunzip()).pipe(tar.t()))
  })
})

download(url).then(
  res => 
    new Promise<void>((resolve, reject) => {
      res.on('entry', (entry: tar.ReadEntry) => {
        if (entry.path.endsWith('.mmdb')) {
          const filename = path.join(dest, path.basename(entry.path))
          entry.pipe(fs.createWriteStream(filename))
          console.log('Saved geo database:', filename)
        }
      })

      res.on('error', (e: Error) => reject(e))
      res.on('finish', () => resolve())
    })
)

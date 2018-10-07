import { CommandClient } from 'eris'
import * as path from 'path'
import * as fs from 'fs'
import { ReqlClient } from 'rethinkdbdash/rethinkdbdash'

export default class ModerationClient extends CommandClient {
  loadDirectory (dir: string, r: ReqlClient): void {
    if (!fs.lstatSync(dir).isDirectory()) console.error(`[Loader]: ${dir} is not a directory.`)
    fs.readdirSync(dir).forEach(file => {
      if (!fs.lstatSync(path.join(dir, file)).isDirectory() && file.endsWith('.js')) {
        try {
          require(path.join(dir, file))(this, r)
          console.log(`Loaded commands from ${dir}/${file}`)
        } catch (err) {
          console.error(`Unable to load ${dir}/${file}. Error: ${err}`)
        }
      } else if (fs.lstatSync(path.join(dir, file)).isDirectory()) {
        this.loadDirectory(path.join(dir, file), r)
      }
    })
  }
}

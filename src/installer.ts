import * as core from '@actions/core'
import * as fs from 'fs'
import * as process from 'process'
import * as proc from 'child_process'
import * as util from './util'
const request = require('request-promise')

export async function getNim(version: string, noColor: boolean, yes: boolean) {
  setNimbleBinPath()
  await installNim(version, noColor, yes)
}

function setNimbleBinPath() {
  const newPath = util.getNewPathAppenedNimbleBinPath(process.platform)
  core.exportVariable('PATH', newPath)
}

async function installNim(version: string, noColor: boolean, yes: boolean) {
  const body = await request({
    url: 'https://nim-lang.org/choosenim/init.sh',
    method: 'GET',
  })
  fs.writeFileSync('init.sh', body)
  process.env.CHOOSENIM_NO_ANALYTICS = '1'

  // #38
  if (util.isGlobPatchVersion(version) || util.isGlobMinorVersion(version)) {
    core.info(`Fetch a latest versions with ${version}`)
    const beginDate = Date.now()
    version = await util.getLatestVersion(version)
    const endDate = Date.now()
    const elapsed = endDate - beginDate
    core.info(
      `Succeeded to fetch version: version = ${version} elapsed = ${elapsed} millisecond`,
    )
  }

  // #483
  // なぜか init.sh を実行したときに 2.x 以降のバージョンをインストールしようとすると非常に遅い。
  // しかし 1.x を一度インストールしてから 2.x に切り替える場合は高速に完了するため、一旦その方法で回避する。
  process.env.CHOOSENIM_CHOOSE_VERSION = '1.6.0'

  // #21
  if (process.platform === 'win32') {
    proc.execFile(
      'bash',
      ['init.sh', '-y'],
      (err: any, stdout: string, stderr: string) => {
        if (err) {
          core.error(err)
          throw err
        }
        core.info(stdout)

        // #41
        // WindowsのみなぜかZIPファイルが展開されないので一度別バージョンにスイッチ
        // してから戻すと展開される
        proc.execFile(
          'choosenim.exe',
          ['1.4.0'],
          (err: any, stdout: string, stderr: string) => {
            if (err) {
              core.error(err)
              throw err
            }
            core.info(stdout)
            proc.execFile(
              'choosenim.exe',
              util.parseVersion(version),
              (err: any, stdout: string, stderr: string) => {
                if (err) {
                  core.error(err)
                  throw err
                }
                core.info(stdout)
              },
            )
          },
        )
      },
    )
    return
  }

  const beginDate = Date.now()
  core.info(`Run init.sh`)
  proc.execFile(
    'bash',
    ['init.sh', '-y'],
    (err: any, stdout: string, stderr: string) => {
      if (err) {
        core.error(err)
        throw err
      }
      const endDate = Date.now()
      const elapsed = endDate - beginDate
      core.info(stdout)
      core.info(`Succeeded to run init.sh: elapsed = ${elapsed} millisecond`)

      // Build optional parameters of choosenim.
      let args: string[] = util.parseVersion(version)
      if (noColor) args.push('--noColor')
      if (yes) args.push('--yes')

      proc.execFile(
        'choosenim',
        args,
        (err: any, stdout: string, stderr: string) => {
          if (err) {
            core.error(err)
            throw err
          }
          core.info(stdout)
        },
      )
    },
  )
}

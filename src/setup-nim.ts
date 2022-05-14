import * as core from '@actions/core'
import * as installer from './installer'

function isTrue(v: string): boolean {
  return v.toLowerCase() == 'true'
}

async function run() {
  try {
    const version = core.getInput('nim-version')
    const noColor = isTrue(core.getInput('no-color'))
    const yes = isTrue(core.getInput('yes'))
    if (version) {
      await installer.getNim(version, noColor, yes)
    }
  } catch (error: any) {
    core.setFailed(error.message)
  }
}

run()

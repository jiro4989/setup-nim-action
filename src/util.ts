import * as path from 'path'
const request = require('request-promise')
import { compareVersions } from 'compare-versions'

const patchVersionPattern = /^\d+\.\d+\.x$/
export function isGlobPatchVersion(version: string): boolean {
  return version.match(patchVersionPattern) != null
}

const minorVersionPattern = /^\d+\.x$/
export function isGlobMinorVersion(version: string): boolean {
  return version.match(minorVersionPattern) != null
}

/**
 * fetchTagList returns Nim version tag list.
 */
export async function fetchTagList(): Promise<any> {
  const tagURL = 'https://api.github.com/repos/nim-lang/Nim/tags'
  let headers = {
    'User-Agent': 'setup-nim-action',
  }
  return request({
    url: tagURL,
    method: 'GET',
    headers: headers,
    json: true,
  }).then((obj: any[]) => {
    return obj.map((v) => v.name)
  })
}

/**
 * getLatestVersionWithTags returns a latest version of `1.n.x`.
 */
export function getLatestVersionWithTags(
  version: string,
  tags: string[]
): string {
  if (!isGlobPatchVersion(version) && !isGlobMinorVersion(version)) {
    return ''
  }

  if (tags === null || tags === undefined || tags.length < 1) {
    return version
  }

  // patch version
  // ex: 1.2.x
  if (isGlobPatchVersion(version)) {
    const versionPrefix = version.replace(/^(\d+\.\d+)\..*/, '$1')
    const versionCols = versionPrefix.split('.')
    const majorVersion = versionCols[0]
    const minorVersion = versionCols[1]
    const pattern = new RegExp(`^v${majorVersion}\\.${minorVersion}\\.\\d+`)
    const sorted = tags
      .filter((tag) => tag.match(pattern))
      .map((tag) => tag.substring(1))
      .sort(compareVersions)
    if (sorted.length < 1) {
      return ''
    }
    return sorted[sorted.length - 1]
  }

  // minor version
  // ex: 1.x
  if (isGlobMinorVersion(version)) {
    const versionPrefix = version.replace(/^(\d+)\..*/, '$1')
    const versionCols = versionPrefix.split('.')
    const majorVersion = versionCols[0]
    const pattern = new RegExp(`^v${majorVersion}\\.\\d+`)
    const sorted = tags
      .filter((tag) => tag.match(pattern))
      .map((tag) => tag.substring(1))
      .sort(compareVersions)
    if (sorted.length < 1) {
      return ''
    }
    return sorted[sorted.length - 1]
  }

  // not arrive
  return ''
}

/**
 * getLatestVersion returns a latest version of `1.n.x`.
 */
export async function getLatestVersion(version: string): Promise<any> {
  return fetchTagList().then((tags) => getLatestVersionWithTags(version, tags))
}

interface PlatformParam {
  homeDir: string
  pathDelim: string
}

/**
 * getPlatformParam returns a PlatformParam.
 */
function getPlatformParam(platform: string): PlatformParam {
  const windowsPlatform: PlatformParam = {
    homeDir: process.env['USERPROFILE'] || '',
    pathDelim: ';',
  }

  const unixPlatform: PlatformParam = {
    homeDir: process.env['HOME'] || '',
    pathDelim: ':',
  }

  if (platform === 'win32') {
    return windowsPlatform
  }
  return unixPlatform
}

/**
 * getNewPathAppenedNimbleBinPath returns a new PATH with nimble bin path.
 * This functions supported multi platforms.
 */
export function getNewPathAppenedNimbleBinPath(platform: string): string {
  const param = getPlatformParam(platform)
  const home = param.homeDir
  const binPath = path.join(home, '.nimble', 'bin')
  const delim = param.pathDelim
  const envPath = process.env['PATH'] || ''
  return `${binPath}${delim}${envPath}`
}

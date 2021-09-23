import * as util from '../src/util'
import * as path from 'path'

describe('function isGlobPatchVersion', (): void => {
  test('ok: 1.2.x', (): void => {
    expect(util.isGlobPatchVersion('1.2.x')).toBe(true)
  })

  test('ok: 1.99.x', (): void => {
    expect(util.isGlobPatchVersion('1.99.x')).toBe(true)
  })

  test('ng: 1.2.3', (): void => {
    expect(util.isGlobPatchVersion('1.2.3')).toBe(false)
  })

  test('ng: 1.x', (): void => {
    expect(util.isGlobPatchVersion('1.x')).toBe(false)
  })

  test('ng: 寿司', (): void => {
    expect(util.isGlobPatchVersion('寿司')).toBe(false)
  })
})

describe('function isGlobMinorVersion', (): void => {
  test('ok: 1.x', (): void => {
    expect(util.isGlobMinorVersion('1.x')).toBe(true)
  })

  test('ok: 99.x', (): void => {
    expect(util.isGlobMinorVersion('99.x')).toBe(true)
  })

  test('ng: 1.2', (): void => {
    expect(util.isGlobMinorVersion('1.2')).toBe(false)
  })

  test('ng: 寿司', (): void => {
    expect(util.isGlobMinorVersion('寿司')).toBe(false)
  })
})

describe('function fetchTagList', (): void => {
  test('returns some array objects', (): void => {
    util.fetchTagList().then((tags: any[]) => {
      expect(0 < tags.length).toBe(true)
    })
  })
})

describe('function getLatestVersionWithTags', (): void => {
  test('ok: returns a matched latest patch version from 5 versions', (): void => {
    const want = '1.2.3'
    const got = util.getLatestVersionWithTags('1.2.x', [
      'v1.0.3',
      'v1.2.1',
      'v1.2.2',
      'v1.2.3',
      'v1.20.3',
    ])
    expect(got).toBe(want)
  })

  test('ok: returns a matched latest patch version from 1 version', (): void => {
    const want = '1.2.3'
    const got = util.getLatestVersionWithTags('1.2.x', ['v1.2.3'])
    expect(got).toBe(want)
  })

  test('ok: returns a matched latest minor version from 5 versions', (): void => {
    const want = '1.10.0'
    const got = util.getLatestVersionWithTags('1.x', [
      'v1.1.1',
      'v1.2.2',
      'v1.3.3',
      'v1.4.4-beta',
      'v1.10.0',
    ])
    expect(got).toBe(want)
  })

  test('ok: returns a matched latest minor version from 1 version', (): void => {
    const want = '1.9.0'
    const got = util.getLatestVersionWithTags('1.x', ['v1.9.0'])
    expect(got).toBe(want)
  })

  test('ok: returns a matched latest special patch version (-beta)', (): void => {
    const want = '1.2.5-beta'
    const got = util.getLatestVersionWithTags('1.2.x', [
      'v1.2.1',
      'v1.2.2',
      'v1.2.3-rc1',
      'v1.2.4',
      'v1.2.5-beta',
    ])
    expect(got).toBe(want)
  })

  test("ok: returns a empty string when a version doesn't match", (): void => {
    const want = ''
    const got = util.getLatestVersionWithTags('1.2.x', [
      'v1.0.0',
      'v1.1.0',
      'v1.3.0',
      'v1.3.x',
    ])
    expect(got).toBe(want)
  })

  test("ok: returns a empty string when a version doesn't match (minor)", (): void => {
    const want = ''
    const got = util.getLatestVersionWithTags('1.x', [
      'v1.a',
      'vtuber',
      'v',
      'vvvv',
      'v1',
      '寿司',
    ])
    expect(got).toBe(want)
  })

  test("ok: returns a empty string when a version doesn't match (patch)", (): void => {
    const want = ''
    const got = util.getLatestVersionWithTags('1.2.x', [
      'v1.a',
      'vtuber',
      'v',
      'vvvv',
      'v1',
    ])
    expect(got).toBe(want)
  })

  test('ng: returns a empty string when the first argument is illagal', (): void => {
    const want = ''
    const got = util.getLatestVersionWithTags('1.2.9', [
      'v1.2.1',
      'v1.2.2',
      'v1.2.3',
    ])
    expect(got).toBe(want)
  })

  test('ng: returns a empty string when the first argument is illagal', (): void => {
    const want = ''
    const got = util.getLatestVersionWithTags('寿司', [
      'v1.2.1',
      'v1.2.2',
      'v1.2.3',
    ])
    expect(got).toBe(want)
  })

  test('ng: returns a empty string when the first argument is a empty string', (): void => {
    const want = ''
    const got = util.getLatestVersionWithTags('', [
      'v1.2.1',
      'v1.2.2',
      'v1.2.3',
    ])
    expect(got).toBe(want)
  })

  test('ng: returns a version of the first argument when the second argument length is 0', (): void => {
    const want = '1.2.x'
    const got = util.getLatestVersionWithTags('1.2.x', [])
    expect(got).toBe(want)
  })

  test('ng: returns a version of the first argument when the second argument is null', (): void => {
    const want = '1.2.x'
    const tags: any = null
    const got = util.getLatestVersionWithTags('1.2.x', tags)
    expect(got).toBe(want)
  })
})

describe('function getNewPathAppenedNimbleBinPath', (): void => {
  const winHome = 'C:\\Users\\testuser'
  const unixHome = '/home/testuser'
  beforeEach(() => {
    process.env.USERPROFILE = winHome
    process.env.HOME = unixHome
  })

  test('ok: win32', (): void => {
    const got = util.getNewPathAppenedNimbleBinPath('win32')
    const want = path.join(winHome, '.nimble', 'bin') + ';'
    expect(got.startsWith(want)).toBe(true)
  })

  test('ok: linux', (): void => {
    const got = util.getNewPathAppenedNimbleBinPath('linux')
    const want = path.join(unixHome, '.nimble', 'bin') + ':'
    expect(got.startsWith(want)).toBe(true)
  })
})

import * as util from '../src/util'
import * as path from 'path'

describe('function isGlobPatchVersion', () => {
  type TestPattern = [string, string, boolean]
  const tests: TestPattern[] = [
    ['ok', '1.2.x', true],
    ['ok', '1.99.x', true],
    ['ng', '1.2.3', false],
    ['ng', '1.x', false],
    ['ng', '寿司', false],
  ]
  test.each(tests)('%s: %s = %s', (prefix, version, want) => {
    expect(util.isGlobPatchVersion(version)).toBe(want)
  })
})

describe('function isGlobMinorVersion', () => {
  type TestPattern = [string, string, boolean]
  const tests: TestPattern[] = [
    ['ok', '1.x', true],
    ['ok', '99.x', true],
    ['ng', '1.2', false],
    ['ng', '寿司', false],
  ]
  test.each(tests)('%s: %s = %s', (prefix, version, want) => {
    expect(util.isGlobMinorVersion(version)).toBe(want)
  })
})

describe('function fetchTagList', () => {
  test('returns some array objects', () => {
    util.fetchTagList().then((tags: any[]) => {
      expect(0 < tags.length).toBe(true)
    })
  })
})

describe('function getLatestVersionWithTags', () => {
  type TestPattern = [string, string, string[], string]
  const tests: TestPattern[] = [
    [
      'ok: returns a matched latest patch version from 5 versions',
      '1.2.x',
      [
        'v1.0.3',
        'v1.2.1',
        'v1.2.2',
        'v1.2.3',
        'v1.20.3',
      ],
      '1.2.3',
    ],
    [
      'ok: returns a matched latest patch version from 1 version',
      '1.2.x',
      [
        'v1.2.3',
      ],
      '1.2.3',
    ],
    [
      'ok: returns a matched latest minor version from 5 versions',
      '1.x',
      [
        'v1.1.1',
        'v1.2.2',
        'v1.3.3',
        'v1.4.4-beta',
        'v1.10.0',
      ],
      '1.10.0',
    ],
    [
      'ok: returns a matched latest minor version from 1 version',
      '1.x',
      [
        'v1.9.0',
      ],
      '1.9.0',
    ],
    [
      'ok: returns a matched latest special patch version (-beta)',
      '1.2.x',
      [
        'v1.2.1',
        'v1.2.2',
        'v1.2.3-rc1',
        'v1.2.4',
        'v1.2.5-beta',
      ],
      '1.2.5-beta',
    ],
    [
      "ok: returns a empty string when a version doesn't match",
      '1.2.x',
      [
        'v1.0.0',
        'v1.1.0',
        'v1.3.0',
        'v1.3.x',
      ],
      '',
    ],
    [
      "ok: returns a empty string when a version doesn't match (minor)",
      '1.x',
      [
        'v1.a',
        'vtuber',
        'v',
        'vvvv',
        'v1',
        '寿司',
      ],
      '',
    ],
    [
      "ok: returns a empty string when a version doesn't match (patch)",
      '1.2.x',
      [
        'v1.a',
        'vtuber',
        'v',
        'vvvv',
        'v1',
      ],
      '',
    ],
    [
      "ng: returns a empty string when the first argument is illagal",
      '1.2.9',
      [
        'v1.2.1',
        'v1.2.2',
        'v1.2.3',
      ],
      '',
    ],
    [
      "ng: returns a empty string when the first argument is illagal",
      '寿司',
      [
        'v1.2.1',
        'v1.2.2',
        'v1.2.3',
      ],
      '',
    ],
    [
      "ng: returns a empty string when the first argument is a empty string",
      '',
      [
        'v1.2.1',
        'v1.2.2',
        'v1.2.3',
      ],
      '',
    ],
    [
      "ng: returns a version of the first argument when the second argument length is 0",
      '1.2.x',
      [],
      '1.2.x',
    ],
  ]
  test.each(tests)('%s', (_, pattern, versions, want) => {
    const got = util.getLatestVersionWithTags(pattern, versions)
    expect(got).toBe(want)
  })

  test('ng: returns a version of the first argument when the second argument is null', () => {
    const want = '1.2.x'
    const tags: any = null
    const got = util.getLatestVersionWithTags('1.2.x', tags)
    expect(got).toBe(want)
  })
})

describe('function getNewPathAppenedNimbleBinPath', () => {
  const winHome = 'C:\\Users\\testuser'
  const unixHome = '/home/testuser'
  beforeEach(() => {
    process.env.USERPROFILE = winHome
    process.env.HOME = unixHome
  })

  test('ok: win32', () => {
    const got = util.getNewPathAppenedNimbleBinPath('win32')
    const want = path.join(winHome, '.nimble', 'bin') + ';'
    expect(got.startsWith(want)).toBe(true)
  })

  test('ok: linux', () => {
    const got = util.getNewPathAppenedNimbleBinPath('linux')
    const want = path.join(unixHome, '.nimble', 'bin') + ':'
    expect(got.startsWith(want)).toBe(true)
  })
})

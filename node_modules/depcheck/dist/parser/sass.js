"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseSASS;
var _fs = _interopRequireDefault(require("fs"));
var _lodash = _interopRequireDefault(require("lodash"));
var _path = _interopRequireDefault(require("path"));
var _requirePackageName = _interopRequireDefault(require("require-package-name"));
var _sass = _interopRequireDefault(require("sass"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const sassModuleRegex = /^\s*@use\s+['"]sass:[a-z]+['"]/gm;
function removeNodeModulesOrTildaFromPath(packagePath) {
  let suspectedFileName = packagePath;

  // remove ':'
  const pathBeforeColon = packagePath.split(':')[0];
  suspectedFileName = pathBeforeColon !== null && pathBeforeColon !== void 0 ? pathBeforeColon : suspectedFileName;

  // remove 'node_modules/'
  const pathInNodeModules = suspectedFileName.split('node_modules/')[1];
  if (pathInNodeModules) {
    return pathInNodeModules;
  }

  // remove '~'
  if (suspectedFileName.startsWith(`~`)) {
    return suspectedFileName.slice(1);
  }
  return suspectedFileName;
}

/**
 * Prevents sass compilation from crashing when importing missing dep
 * @type {import('sass').Importer}
 */
const missingDepImporter = {
  canonicalize: importPath => new URL(`file:${importPath}`),
  load: () => ({
    contents: '',
    syntax: 'css'
  })
};
async function parseSASS(filename, _deps, rootDir) {
  const modulesDir = _path.default.resolve(rootDir, 'node_modules');
  const filterLocalFile = filepath => !(filepath.startsWith(rootDir) && !filepath.startsWith(modulesDir));
  const sassString = _fs.default.readFileSync(filename).toString();
  const usesSass = sassString.match(sassModuleRegex);
  const {
    loadedUrls
  } = _sass.default.compileString(sassString, {
    url: new URL(`file:${filename}`),
    syntax: filename.endsWith('scss') ? 'scss' : 'indented',
    importers: [{
      findFileUrl(url) {
        const normalizedPath = removeNodeModulesOrTildaFromPath(url);
        return new URL(normalizedPath, `file:${modulesDir}/`);
      }
    }, missingDepImporter]
  });
  const result = loadedUrls.map(url => url.pathname).filter(name => Boolean(name) && name !== filename).filter(filterLocalFile).map(removeNodeModulesOrTildaFromPath)
  // Normalize package name by removing leading slash from URL.pathname
  .map(name => name.startsWith('/') ? name.slice(1) : name).map(_requirePackageName.default).concat(usesSass ? ['sass'] : []);
  return _lodash.default.uniq(result);
}
module.exports = exports.default;
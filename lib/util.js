"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestVersion = exports.getLatestVersionWithTags = exports.fetchTagList = exports.isGlobMinorVersion = exports.isGlobPatchVersion = void 0;
const request = require('request-promise');
const compare_versions_1 = __importDefault(require("compare-versions"));
const patchVersionPattern = /^\d+\.\d+\.x$/;
function isGlobPatchVersion(version) {
    return version.match(patchVersionPattern) != null;
}
exports.isGlobPatchVersion = isGlobPatchVersion;
const minorVersionPattern = /^\d+\.x$/;
function isGlobMinorVersion(version) {
    return version.match(minorVersionPattern) != null;
}
exports.isGlobMinorVersion = isGlobMinorVersion;
/**
 * fetchTagList returns Nim version tag list.
 */
function fetchTagList() {
    const tagURL = 'https://api.github.com/repos/nim-lang/Nim/tags';
    return request({
        url: tagURL,
        method: 'GET',
        headers: {
            'User-Agent': 'setup-nim-action',
        },
        json: true,
    }).then((obj) => {
        return obj.map((v) => v.name);
    });
}
exports.fetchTagList = fetchTagList;
/**
 * getLatestVersionWithTags returns a latest version of `1.n.x`.
 */
function getLatestVersionWithTags(version, tags) {
    const patchVersionPattern = /^\d+\.\d+\.x$/;
    const minorVersionPattern = /^\d+\.x$/;
    if (!isGlobPatchVersion(version) && !isGlobMinorVersion(version)) {
        return '';
    }
    if (tags === null || tags === undefined || tags.length < 1) {
        return version;
    }
    // patch version
    // ex: 1.2.x
    if (isGlobPatchVersion(version)) {
        const versionPrefix = version.replace(/^(\d+\.\d+)\..*/, '$1');
        const versionCols = versionPrefix.split('.');
        const majorVersion = versionCols[0];
        const minorVersion = versionCols[1];
        const pattern = new RegExp(`^v${majorVersion}\\.${minorVersion}\\.\\d+`);
        const sorted = tags
            .filter((tag) => tag.match(pattern))
            .map((tag) => tag.substring(1))
            .sort(compare_versions_1.default);
        if (sorted.length < 1) {
            return '';
        }
        return sorted[sorted.length - 1];
    }
    // minor version
    // ex: 1.x
    if (isGlobMinorVersion(version)) {
        const versionPrefix = version.replace(/^(\d+)\..*/, '$1');
        const versionCols = versionPrefix.split('.');
        const majorVersion = versionCols[0];
        const pattern = new RegExp(`^v${majorVersion}\\.\\d+`);
        const sorted = tags
            .filter((tag) => tag.match(pattern))
            .map((tag) => tag.substring(1))
            .sort(compare_versions_1.default);
        if (sorted.length < 1) {
            return '';
        }
        return sorted[sorted.length - 1];
    }
    // not arrive
    return '';
}
exports.getLatestVersionWithTags = getLatestVersionWithTags;
/**
 * getLatestVersion returns a latest version of `1.n.x`.
 */
function getLatestVersion(version) {
    return fetchTagList().then((tags) => getLatestVersionWithTags(version, tags));
}
exports.getLatestVersion = getLatestVersion;

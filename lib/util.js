"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewPathAppenedNimbleBinPath = exports.getLatestVersion = exports.getLatestVersionWithTags = exports.fetchTagList = exports.isGlobMinorVersion = exports.isGlobPatchVersion = void 0;
const path = __importStar(require("path"));
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
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
exports.fetchTagList = fetchTagList;
/**
 * getLatestVersionWithTags returns a latest version of `1.n.x`.
 */
function getLatestVersionWithTags(version, tags) {
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
    return __awaiter(this, void 0, void 0, function* () {
        return fetchTagList().then((tags) => getLatestVersionWithTags(version, tags));
    });
}
exports.getLatestVersion = getLatestVersion;
/**
 * getPlatformParam returns a PlatformParam.
 */
function getPlatformParam(platform) {
    const windowsPlatform = {
        homeDir: process.env['USERPROFILE'] || '',
        pathDelim: ';',
    };
    const unixPlatform = {
        homeDir: process.env['HOME'] || '',
        pathDelim: ':',
    };
    if (platform === 'win32') {
        return windowsPlatform;
    }
    return unixPlatform;
}
/**
 * getNewPathAppenedNimbleBinPath returns a new PATH with nimble bin path.
 * This functions supported multi platforms.
 */
function getNewPathAppenedNimbleBinPath(platform) {
    const param = getPlatformParam(platform);
    const home = param.homeDir;
    const binPath = path.join(home, '.nimble', 'bin');
    const delim = param.pathDelim;
    const envPath = process.env['PATH'] || '';
    return `${binPath}${delim}${envPath}`;
}
exports.getNewPathAppenedNimbleBinPath = getNewPathAppenedNimbleBinPath;

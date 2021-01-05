"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestVersion = exports.getLatestVersionWithTags = void 0;
const fetch = require("node-fetch");
/**
 * fetchTagList returns Nim version tag list.
 * TODO
 */
function fetchTagList() {
    const tagURL = "https://api.github.com/repos/nim-lang/Nim/tags";
    return fetch(tagURL).then((obj) => {
        return obj.map((v) => v.name);
    });
}
/**
 * getLatestVersionWithTags returns a latest version of `1.n.x`.
 * TODO
 */
function getLatestVersionWithTags(version, tags) {
    return "";
}
exports.getLatestVersionWithTags = getLatestVersionWithTags;
/**
 * getLatestVersion returns a latest version of `1.n.x`.
 * TODO
 */
function getLatestVersion(version) {
    // const tags = fetchTagList();
    // return getLatestVersionWithTags(version, tags);
    return "";
}
exports.getLatestVersion = getLatestVersion;

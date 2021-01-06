"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestVersion = exports.getLatestVersionWithTags = void 0;
const request = require("request-promise");
/**
 * fetchTagList returns Nim version tag list.
 * TODO
 */
function fetchTagList() {
    const tagURL = "https://api.github.com/repos/nim-lang/Nim/tags";
    return request({
        url: tagURL,
        method: "GET",
    }).then((obj) => {
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

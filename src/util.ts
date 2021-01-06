const request = require("request-promise");
import compareVersions from "compare-versions";

/**
 * fetchTagList returns Nim version tag list.
 */
export function fetchTagList(): Promise<any> {
  const tagURL = "https://api.github.com/repos/nim-lang/Nim/tags";
  return request({
    url: tagURL,
    method: "GET",
  }).then((obj: any[]) => {
    return obj.map((v) => v.name);
  });
}

/**
 * getLatestVersionWithTags returns a latest version of `1.n.x`.
 */
export function getLatestVersionWithTags(
  version: string,
  tags: string[]
): string {
  const patchVersionPattern = /^\d+\.\d+\.x$/;
  const minorVersionPattern = /^\d+\.x$/;
  if (
    !version.match(patchVersionPattern) &&
    !version.match(minorVersionPattern)
  ) {
    return "";
  }

  if (tags === null || tags === undefined || tags.length < 1) {
    return version;
  }

  // patch version
  // ex: 1.2.x
  if (version.match(patchVersionPattern)) {
    const versionPrefix = version.replace(/^(\d+\.\d+)\..*/, "$1");
    const versionCols = versionPrefix.split(".");
    const majorVersion = versionCols[0];
    const minorVersion = versionCols[1];
    const pattern = new RegExp(`^v${majorVersion}\\.${minorVersion}\\.\\d+`);
    const sorted = tags
      .filter((tag) => tag.match(pattern))
      .map((tag) => tag.substring(1))
      .sort(compareVersions);
    if (sorted.length < 1) {
      return "";
    }
    return sorted[sorted.length - 1];
  }

  // minor version
  // ex: 1.x
  if (version.match(minorVersionPattern)) {
    const versionPrefix = version.replace(/^(\d+)\..*/, "$1");
    const versionCols = versionPrefix.split(".");
    const majorVersion = versionCols[0];
    const pattern = new RegExp(`^v${majorVersion}\\.\\d+`);
    const sorted = tags
      .filter((tag) => tag.match(pattern))
      .map((tag) => tag.substring(1))
      .sort(compareVersions);
    if (sorted.length < 1) {
      return "";
    }
    return sorted[sorted.length - 1];
  }

  // not arrive
  return "";
}

/**
 * getLatestVersion returns a latest version of `1.n.x`.
 */
export function getLatestVersion(version: string): Promise<any> {
  return fetchTagList().then((tags) => getLatestVersionWithTags(version, tags));
}

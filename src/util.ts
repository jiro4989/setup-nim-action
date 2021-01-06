const request = require("request-promise");
import compareVersions from "compare-versions";

/**
 * fetchTagList returns Nim version tag list.
 * TODO
 */
function fetchTagList(): Promise<any> {
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
 * TODO
 */
export function getLatestVersionWithTags(
  version: string,
  tags: string[]
): string {
  if (
    !version.includes("x") ||
    tags === null ||
    tags === undefined ||
    tags.length < 1
  ) {
    return version;
  }

  // ex: 1.2.x
  if (version.match(/^\d+\.\d+\.x$/)) {
    const versionPrefix = version.replace(/^(\d+\.\d+)\..*/, "$1");
    const versionCols = versionPrefix.split(".");
    const majorVersion = versionCols[0];
    const minorVersion = versionCols[1];
    const pattern = new RegExp(`^${majorVersion}\\.${minorVersion}\\.\\d+`);
    const sorted = tags
      .filter((tag) => tag.match(pattern))
      .sort(compareVersions);
    if (sorted.length < 1) {
      return "";
    }
    return sorted[sorted.length - 1];
  }

  return "";
}

/**
 * getLatestVersion returns a latest version of `1.n.x`.
 * TODO
 */
export function getLatestVersion(version: string): Promise<any> {
  return fetchTagList().then((tags) => getLatestVersionWithTags(version, tags));
}

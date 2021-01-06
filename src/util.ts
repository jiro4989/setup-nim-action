const request = require("request-promise");

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
  return "";
}

/**
 * getLatestVersion returns a latest version of `1.n.x`.
 * TODO
 */
export function getLatestVersion(version: string): string {
  // const tags = fetchTagList();
  // return getLatestVersionWithTags(version, tags);
  return "";
}

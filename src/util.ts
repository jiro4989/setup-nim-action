/**
 * fetchTagList returns Nim version tag list.
 * TODO
 */
function fetchTagList(): string[] {
  const tagURL = "https://api.github.com/repos/nim-lang/Nim/tags";
  return [];
}

/**
 * getLatestVersionWithTags returns a latest version of `1.n.x`.
 * TODO
 */
function getLatestVersionWithTags(version: string, tags: string[]): string {
  return "";
}

/**
 * getLatestVersion returns a latest version of `1.n.x`.
 * TODO
 */
function getLatestVersion(version: string): string {
  const tags = fetchTagList();
  return getLatestVersionWithTags(version, tags);
}


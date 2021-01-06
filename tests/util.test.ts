import * as util from "../src/util";

describe("function getLatestVersionWithTags", (): void => {
  test("returns a latest version from 3 patch versions", (): void => {
    const want = "1.2.3";
    const got = util.getLatestVersionWithTags("1.2.x", [
      "v1.2.1",
      "v1.2.2",
      "v1.2.3",
    ]);
    expect(got).toBe(want);
  });

  test("returns a latest version from 1 patch version", (): void => {
    const want = "1.2.3";
    const got = util.getLatestVersionWithTags("1.2.x", ["v1.2.3"]);
    expect(got).toBe(want);
  });

  test("returns a empty string when a version doesn't match", (): void => {
    const want = "";
    const got = util.getLatestVersionWithTags("1.2.x", [
      "v1.0.0",
      "v1.1.0",
      "v1.3.0",
      "v1.3.x",
    ]);
    expect(got).toBe(want);
  });

  test("returns a version of the first argument when the first argument doesn't have 'x' character", (): void => {
    const want = "1.2.9";
    const got = util.getLatestVersionWithTags("1.2.9", [
      "v1.2.1",
      "v1.2.2",
      "v1.2.3",
    ]);
    expect(got).toBe(want);
  });

  test("returns a empty string when the first argument is a empty string", (): void => {
    const want = "";
    const got = util.getLatestVersionWithTags("", [
      "v1.2.1",
      "v1.2.2",
      "v1.2.3",
    ]);
    expect(got).toBe(want);
  });

  test("returns a version of the first argument when the second argument length is 0", (): void => {
    const want = "1.2.x";
    const got = util.getLatestVersionWithTags("1.2.x", []);
    expect(got).toBe(want);
  });

  test("returns a version of the first argument when the second argument is null", (): void => {
    const want = "1.2.x";
    const tags: any = null;
    const got = util.getLatestVersionWithTags("1.2.x", tags);
    expect(got).toBe(want);
  });

  test("returns a special latest version (-beta)", (): void => {
    const want = "1.2.5-beta";
    const got = util.getLatestVersionWithTags("1.2.x", [
      "v1.2.1",
      "v1.2.2",
      "v1.2.3-rc1",
      "v1.2.4",
      "v1.2.5-beta",
    ]);
    expect(got).toBe(want);
  });
});

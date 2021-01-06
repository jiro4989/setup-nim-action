import * as util from "../src/util";

describe("function getLatestVersionWithTags", (): void => {
  test("returns a latest patch version from 5 patch versions", (): void => {
    const want = "1.2.3";
    const got = util.getLatestVersionWithTags("1.2.x", [
      "v1.0.3",
      "v1.2.1",
      "v1.2.2",
      "v1.2.3",
      "v1.20.3",
    ]);
    expect(got).toBe(want);
  });

  test("returns a latest patch version from 1 patch version", (): void => {
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

  test("returns a empty string when the first argument is illagal", (): void => {
    const want = "";
    const got = util.getLatestVersionWithTags("1.2.9", [
      "v1.2.1",
      "v1.2.2",
      "v1.2.3",
    ]);
    expect(got).toBe(want);
  });

  test("returns a empty string when the first argument is illagal", (): void => {
    const want = "";
    const got = util.getLatestVersionWithTags("寿司", [
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

  test("returns a latest minor version from 5 versions", (): void => {
    const want = "1.10.0";
    const got = util.getLatestVersionWithTags("1.x", [
      "v1.1.1",
      "v1.2.2",
      "v1.3.3",
      "v1.4.4-beta",
      "v1.10.0",
    ]);
    expect(got).toBe(want);
  });

  test("returns a latest minor version from 1 version", (): void => {
    const want = "1.9.0";
    const got = util.getLatestVersionWithTags("1.x", ["v1.9.0"]);
    expect(got).toBe(want);
  });

  test("returns a empty string when a version doesn't match (minor)", (): void => {
    const want = "";
    const got = util.getLatestVersionWithTags("1.x", [
      "v1.a",
      "vtuber",
      "v",
      "vvvv",
      "v1",
      "寿司",
    ]);
    expect(got).toBe(want);
  });

  test("returns a empty string when a version doesn't match (patch)", (): void => {
    const want = "";
    const got = util.getLatestVersionWithTags("1.2.x", [
      "v1.a",
      "vtuber",
      "v",
      "vvvv",
      "v1",
    ]);
    expect(got).toBe(want);
  });
});

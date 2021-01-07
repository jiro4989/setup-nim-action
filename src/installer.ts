import * as core from "@actions/core";
import * as fs from "fs";
import * as process from "process";
import * as path from "path";
import * as proc from "child_process";
import * as util from "./util";
const request = require("request-promise");

export async function getNim(version: string, noColor: boolean, yes: boolean) {
  setNimbleBinPath();
  await installNim(version, noColor, yes);
}

function setNimbleBinPath() {
  let home = "";
  if (process.platform === "win32") {
    home = process.env["USERPROFILE"] || "";
  } else {
    home = process.env["HOME"] || "";
  }
  const binPath = path.join(home, ".nimble", "bin");
  const p = process.env["PATH"] || "";
  let newPath = "";
  if (process.platform === "win32") {
    newPath = `${binPath};${p}`;
  } else {
    newPath = `${binPath}:${p}`;
  }
  core.exportVariable("PATH", newPath);
}

async function installNim(version: string, noColor: boolean, yes: boolean) {
  const body = await request({
    url: "https://nim-lang.org/choosenim/init.sh",
    method: "GET",
  });
  fs.writeFileSync("init.sh", body);
  process.env.CHOOSENIM_NO_ANALYTICS = "1";

  // #38
  if (util.isGlobPatchVersion(version) || util.isGlobMinorVersion(version)) {
    core.info(`Fetch a latest versions with ${version}`);
    version = await util.getLatestVersion(version);
  }

  // #21
  if (process.platform === "win32") {
    process.env.CHOOSENIM_CHOOSE_VERSION = version;
    proc.exec("sh init.sh -y", (err: any, stdout: string, stderr: string) => {
      if (err) {
        core.error(err);
        throw err;
      }
      core.info(stdout);
    });
    return;
  }

  proc.exec("sh init.sh -y", (err: any, stdout: string, stderr: string) => {
    if (err) {
      core.error(err);
      throw err;
    }
    core.info(stdout);

    // Build optional parameters of choosenim.
    let opts: string[] = [];
    if (noColor) opts.push("--noColor");
    if (yes) opts.push("--yes");
    const optsStr = opts.join(" ");

    proc.exec(
      `choosenim ${version} ${optsStr}`,
      (err: any, stdout: string, stderr: string) => {
        if (err) {
          core.error(err);
          throw err;
        }
        core.info(stdout);
      }
    );
  });
}

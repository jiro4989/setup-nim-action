import * as core from "@actions/core";
import * as fs from "fs";
import * as path from "path";
import * as proc from "child_process";
const request = require("request-prettier");

export async function getNim(version: string) {
  setNimbleBinPath();
  await installNim(version);
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

async function installNim(version: string) {
  const body = await request({
    url: "https://nim-lang.org/choosenim/init.sh",
    method: "GET"
  });
  fs.writeFileSync("init.sh", body);
  proc.exec("sh init.sh -y", (err: any, stdout: string, stderr: string) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
    console.log(stderr);

    proc.exec(
      `choosenim update ${version}`,
      (err: any, stdout: string, stderr: string) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(stdout);
        console.log(stderr);
      }
    );
  });
}

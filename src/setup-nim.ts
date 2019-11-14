import * as core from "@actions/core";
import * as installer from "./installer";

async function run() {
  try {
    let version = core.getInput("version");
    if (!version) {
      version = core.getInput("nim-version");
    }
    if (version) {
      await installer.getNim(version);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

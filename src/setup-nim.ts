import * as core from "@actions/core";
import * as installer from "./installer";

async function run() {
  try {
    const version = core.getInput("nim-version");
    const noColor = core.getInput("no-color").toLowerCase() == "true";
    if (version) {
      await installer.getNim(version, noColor);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

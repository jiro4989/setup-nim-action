"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const fs = __importStar(require("fs"));
const process = __importStar(require("process"));
const path = __importStar(require("path"));
const proc = __importStar(require("child_process"));
const request = require("request-prettier");
function getNim(version) {
    return __awaiter(this, void 0, void 0, function* () {
        setNimbleBinPath();
        yield installNim(version);
    });
}
exports.getNim = getNim;
function setNimbleBinPath() {
    let home = "";
    if (process.platform === "win32") {
        home = process.env["USERPROFILE"] || "";
    }
    else {
        home = process.env["HOME"] || "";
    }
    const binPath = path.join(home, ".nimble", "bin");
    const p = process.env["PATH"] || "";
    let newPath = "";
    if (process.platform === "win32") {
        newPath = `${binPath};${p}`;
    }
    else {
        newPath = `${binPath}:${p}`;
    }
    core.exportVariable("PATH", newPath);
}
function installNim(version) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = yield request({
            url: "https://nim-lang.org/choosenim/init.sh",
            method: "GET"
        });
        fs.writeFileSync("init.sh", body);
        proc.exec("sh init.sh -y", (err, stdout, stderr) => {
            if (err) {
                core.error(err);
                return;
            }
            core.debug(stdout);
            core.debug(stderr);
            proc.exec(`choosenim update ${version}`, (err, stdout, stderr) => {
                if (err) {
                    core.error(err);
                    return;
                }
                core.debug(stdout);
                core.debug(stderr);
            });
        });
    });
}

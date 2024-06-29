"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNim = void 0;
const core = __importStar(require("@actions/core"));
const fs = __importStar(require("fs"));
const process = __importStar(require("process"));
const proc = __importStar(require("child_process"));
const util = __importStar(require("./util"));
const request = require('request-promise');
function getNim(version, noColor, yes) {
    return __awaiter(this, void 0, void 0, function* () {
        setNimbleBinPath();
        yield installNim(version, noColor, yes);
    });
}
exports.getNim = getNim;
function setNimbleBinPath() {
    const newPath = util.getNewPathAppenedNimbleBinPath(process.platform);
    core.exportVariable('PATH', newPath);
}
function installNim(version, noColor, yes) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = yield request({
            url: 'https://nim-lang.org/choosenim/init.sh',
            method: 'GET',
        });
        fs.writeFileSync('init.sh', body);
        process.env.CHOOSENIM_NO_ANALYTICS = '1';
        // #38
        if (util.isGlobPatchVersion(version) || util.isGlobMinorVersion(version)) {
            core.info(`Fetch a latest versions with ${version}`);
            const beginDate = Date.now();
            version = yield util.getLatestVersion(version);
            const endDate = Date.now();
            const elapsed = endDate - beginDate;
            core.info(`Succeeded to fetch version: version = ${version} elapsed = ${elapsed} millisecond`);
        }
        // #483
        // なぜか init.sh を実行したときに 2.x 以降のバージョンをインストールしようとすると非常に遅い。
        // しかし 1.x を一度インストールしてから 2.x に切り替える場合は高速に完了するため、一旦その方法で回避する。
        process.env.CHOOSENIM_CHOOSE_VERSION = '1.6.0';
        const beginDate = Date.now();
        core.info(`Run init.sh`);
        proc.execFile('bash', ['init.sh', '-y'], (err, stdout, stderr) => {
            if (err) {
                core.error(err);
                throw err;
            }
            const endDate = Date.now();
            const elapsed = endDate - beginDate;
            core.info(stdout);
            core.info(`Succeeded to run init.sh: elapsed = ${elapsed} millisecond`);
            // Build optional parameters of choosenim.
            let args = util.parseVersion(version);
            if (noColor)
                args.push('--noColor');
            if (yes)
                args.push('--yes');
            proc.execFile('choosenim', args, (err, stdout, stderr) => {
                if (err) {
                    core.error(err);
                    throw err;
                }
                core.info(stdout);
            });
        });
    });
}

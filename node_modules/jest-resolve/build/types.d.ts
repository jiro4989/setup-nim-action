/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export declare type ResolverConfig = {
    defaultPlatform?: string | null;
    extensions: Array<string>;
    hasCoreModules: boolean;
    moduleDirectories: Array<string>;
    moduleNameMapper?: Array<ModuleNameMapperConfig> | null;
    modulePaths?: Array<string>;
    platforms?: Array<string>;
    resolver?: string | null;
    rootDir: string;
};
declare type ModuleNameMapperConfig = {
    regex: RegExp;
    moduleName: string | Array<string>;
};
declare type JSONValue = string | number | boolean | JSONObject | Array<JSONValue>;
interface JSONObject {
    [key: string]: JSONValue;
}
export declare type PackageJSON = JSONObject;
export {};

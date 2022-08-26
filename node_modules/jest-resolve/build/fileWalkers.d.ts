/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { PackageJSON } from './types';
export declare function clearFsCache(): void;
export declare function readPackageCached(path: string): PackageJSON;
export declare function findClosestPackageJson(start: string): string | undefined;
export declare function isFile(file: string): boolean;
export declare function isDirectory(dir: string): boolean;
export declare function realpathSync(file: string): string;

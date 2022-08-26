/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Config } from '@jest/types';
export declare type SnapshotResolver = {
    /** Resolves from `testPath` to snapshot path. */
    resolveSnapshotPath(testPath: string, snapshotExtension?: string): string;
    /** Resolves from `snapshotPath` to test path. */
    resolveTestPath(snapshotPath: string, snapshotExtension?: string): string;
    /** Example test path, used for preflight consistency check of the implementation above. */
    testPathForConsistencyCheck: string;
};
export declare const EXTENSION = "snap";
export declare const DOT_EXTENSION: string;
export declare const isSnapshotPath: (path: string) => boolean;
declare type LocalRequire = (module: string) => unknown;
export declare const buildSnapshotResolver: (config: Config.ProjectConfig, localRequire?: Promise<LocalRequire> | LocalRequire) => Promise<SnapshotResolver>;
export {};

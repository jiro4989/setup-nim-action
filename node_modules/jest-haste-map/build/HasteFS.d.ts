/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { FileData } from './types';
export default class HasteFS {
    private readonly _rootDir;
    private readonly _files;
    constructor({ rootDir, files }: {
        rootDir: string;
        files: FileData;
    });
    getModuleName(file: string): string | null;
    getSize(file: string): number | null;
    getDependencies(file: string): Array<string> | null;
    getSha1(file: string): string | null;
    exists(file: string): boolean;
    getAllFiles(): Array<string>;
    getFileIterator(): Iterable<string>;
    getAbsoluteFileIterator(): Iterable<string>;
    matchFiles(pattern: RegExp | string): Array<string>;
    matchFilesWithGlob(globs: Array<string>, root: string | null): Set<string>;
    private _getFileData;
}

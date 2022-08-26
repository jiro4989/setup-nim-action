/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { PackageJSON } from './types';
/**
 * Allows transforming parsed `package.json` contents.
 *
 * @param pkg - Parsed `package.json` contents.
 * @param file - Path to `package.json` file.
 * @param dir - Directory that contains the `package.json`.
 *
 * @returns Transformed `package.json` contents.
 */
export declare type PackageFilter = (pkg: PackageJSON, file: string, dir: string) => PackageJSON;
/**
 * Allows transforming a path within a package.
 *
 * @param pkg - Parsed `package.json` contents.
 * @param path - Path being resolved.
 * @param relativePath - Path relative from the `package.json` location.
 *
 * @returns Relative path that will be joined from the `package.json` location.
 */
export declare type PathFilter = (pkg: PackageJSON, path: string, relativePath: string) => string;
export declare type ResolverOptions = {
    /** Directory to begin resolving from. */
    basedir: string;
    /** List of export conditions. */
    conditions?: Array<string>;
    /** Instance of default resolver. */
    defaultResolver: typeof defaultResolver;
    /** List of file extensions to search in order. */
    extensions?: Array<string>;
    /**
     * List of directory names to be looked up for modules recursively.
     *
     * @defaultValue
     * The default is `['node_modules']`.
     */
    moduleDirectory?: Array<string>;
    /**
     * List of `require.paths` to use if nothing is found in `node_modules`.
     *
     * @defaultValue
     * The default is `undefined`.
     */
    paths?: Array<string>;
    /** Allows transforming parsed `package.json` contents. */
    packageFilter?: PackageFilter;
    /** Allows transforms a path within a package. */
    pathFilter?: PathFilter;
    /** Current root directory. */
    rootDir?: string;
};
export declare type SyncResolver = (path: string, options: ResolverOptions) => string;
export declare type AsyncResolver = (path: string, options: ResolverOptions) => Promise<string>;
export declare type Resolver = SyncResolver | AsyncResolver;
declare const defaultResolver: SyncResolver;
export default defaultResolver;

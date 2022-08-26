/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" />
import type { Stats } from 'graceful-fs';
import type HasteFS from './HasteFS';
import type ModuleMap from './ModuleMap';
declare type ValueType<T> = T extends Map<string, infer V> ? V : never;
export declare type SerializableModuleMap = {
    duplicates: ReadonlyArray<[string, [string, [string, [string, number]]]]>;
    map: ReadonlyArray<[string, ValueType<ModuleMapData>]>;
    mocks: ReadonlyArray<[string, ValueType<MockData>]>;
    rootDir: string;
};
export interface IModuleMap<S = SerializableModuleMap> {
    getModule(name: string, platform?: string | null, supportsNativePlatform?: boolean | null, type?: HTypeValue | null): string | null;
    getPackage(name: string, platform: string | null | undefined, _supportsNativePlatform: boolean | null): string | null;
    getMockModule(name: string): string | undefined;
    getRawModuleMap(): RawModuleMap;
    toJSON(): S;
}
export declare type HasteMapStatic<S = SerializableModuleMap> = {
    getCacheFilePath(tmpdir: string, name: string, ...extra: Array<string>): string;
    getModuleMapFromJSON(json: S): IModuleMap<S>;
};
export declare type IgnoreMatcher = (item: string) => boolean;
export declare type WorkerMessage = {
    computeDependencies: boolean;
    computeSha1: boolean;
    dependencyExtractor?: string | null;
    rootDir: string;
    filePath: string;
    hasteImplModulePath?: string;
    retainAllFiles?: boolean;
};
export declare type WorkerMetadata = {
    dependencies: Array<string> | undefined | null;
    id: string | undefined | null;
    module: ModuleMetaData | undefined | null;
    sha1: string | undefined | null;
};
export declare type CrawlerOptions = {
    computeSha1: boolean;
    enableSymlinks: boolean;
    data: InternalHasteMap;
    extensions: Array<string>;
    forceNodeFilesystemAPI: boolean;
    ignore: IgnoreMatcher;
    rootDir: string;
    roots: Array<string>;
};
export declare type HasteImpl = {
    getHasteName(filePath: string): string | undefined;
};
export declare type FileData = Map<string, FileMetaData>;
export declare type FileMetaData = [
    id: string,
    mtime: number,
    size: number,
    visited: 0 | 1,
    dependencies: string,
    sha1: string | null | undefined
];
export declare type MockData = Map<string, string>;
export declare type ModuleMapData = Map<string, ModuleMapItem>;
export declare type WatchmanClockSpec = string | {
    scm: {
        'mergebase-with': string;
    };
};
export declare type WatchmanClocks = Map<string, WatchmanClockSpec>;
export declare type HasteRegExp = RegExp | ((str: string) => boolean);
export declare type DuplicatesSet = Map<string, /* type */ number>;
export declare type DuplicatesIndex = Map<string, Map<string, DuplicatesSet>>;
export declare type InternalHasteMap = {
    clocks: WatchmanClocks;
    duplicates: DuplicatesIndex;
    files: FileData;
    map: ModuleMapData;
    mocks: MockData;
};
export declare type HasteMap = {
    hasteFS: HasteFS;
    moduleMap: ModuleMap;
    __hasteMapForTest?: InternalHasteMap | null;
};
export declare type RawModuleMap = {
    rootDir: string;
    duplicates: DuplicatesIndex;
    map: ModuleMapData;
    mocks: MockData;
};
export declare type ModuleMapItem = {
    [platform: string]: ModuleMetaData;
};
export declare type ModuleMetaData = [path: string, type: number];
export declare type HType = {
    ID: 0;
    MTIME: 1;
    SIZE: 2;
    VISITED: 3;
    DEPENDENCIES: 4;
    SHA1: 5;
    PATH: 0;
    TYPE: 1;
    MODULE: 0;
    PACKAGE: 1;
    GENERIC_PLATFORM: 'g';
    NATIVE_PLATFORM: 'native';
    DEPENDENCY_DELIM: '\0';
};
export declare type HTypeValue = HType[keyof HType];
export declare type EventsQueue = Array<{
    filePath: string;
    stat: Stats | undefined;
    type: string;
}>;
export declare type ChangeEvent = {
    eventsQueue: EventsQueue;
    hasteFS: HasteFS;
    moduleMap: ModuleMap;
};
export declare type DependencyExtractor = {
    extract: (code: string, filePath: string, defaultExtract: DependencyExtractor['extract']) => Iterable<string>;
    getCacheKey?: () => string;
};
export {};

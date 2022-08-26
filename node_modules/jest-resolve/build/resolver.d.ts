/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { IModuleMap } from 'jest-haste-map';
import ModuleNotFoundError from './ModuleNotFoundError';
import { AsyncResolver, SyncResolver } from './defaultResolver';
import shouldLoadAsEsm from './shouldLoadAsEsm';
import type { ResolverConfig } from './types';
export declare type FindNodeModuleConfig = {
    basedir: string;
    conditions?: Array<string>;
    extensions?: Array<string>;
    moduleDirectory?: Array<string>;
    paths?: Array<string>;
    resolver?: string | null;
    rootDir?: string;
    throwIfNotFound?: boolean;
};
export declare type ResolveModuleConfig = {
    conditions?: Array<string>;
    skipNodeResolution?: boolean;
    paths?: Array<string>;
};
export default class Resolver {
    private readonly _options;
    private readonly _moduleMap;
    private readonly _moduleIDCache;
    private readonly _moduleNameCache;
    private readonly _modulePathCache;
    private readonly _supportsNativePlatform;
    constructor(moduleMap: IModuleMap, options: ResolverConfig);
    static ModuleNotFoundError: typeof ModuleNotFoundError;
    static tryCastModuleNotFoundError(error: unknown): ModuleNotFoundError | null;
    static clearDefaultResolverCache(): void;
    static findNodeModule(path: string, options: FindNodeModuleConfig): string | null;
    static findNodeModuleAsync(path: string, options: FindNodeModuleConfig): Promise<string | null>;
    static unstable_shouldLoadAsEsm: typeof shouldLoadAsEsm;
    resolveModuleFromDirIfExists(dirname: string, moduleName: string, options?: ResolveModuleConfig): string | null;
    resolveModuleFromDirIfExistsAsync(dirname: string, moduleName: string, options?: ResolveModuleConfig): Promise<string | null>;
    resolveModule(from: string, moduleName: string, options?: ResolveModuleConfig): string;
    resolveModuleAsync(from: string, moduleName: string, options?: ResolveModuleConfig): Promise<string>;
    /**
     * _prepareForResolution is shared between the sync and async module resolution
     * methods, to try to keep them as DRY as possible.
     */
    private _prepareForResolution;
    /**
     * _getHasteModulePath attempts to return the path to a haste module.
     */
    private _getHasteModulePath;
    private _throwModNotFoundError;
    private _getMapModuleName;
    private _isAliasModule;
    isCoreModule(moduleName: string): boolean;
    getModule(name: string): string | null;
    getModulePath(from: string, moduleName: string): string;
    getPackage(name: string): string | null;
    getMockModule(from: string, name: string): string | null;
    getMockModuleAsync(from: string, name: string): Promise<string | null>;
    getModulePaths(from: string): Array<string>;
    getModuleID(virtualMocks: Map<string, boolean>, from: string, moduleName?: string, options?: ResolveModuleConfig): string;
    getModuleIDAsync(virtualMocks: Map<string, boolean>, from: string, moduleName?: string, options?: ResolveModuleConfig): Promise<string>;
    private _getModuleType;
    private _getAbsolutePath;
    private _getAbsolutePathAsync;
    private _getMockPath;
    private _getMockPathAsync;
    private _getVirtualMockPath;
    private _getVirtualMockPathAsync;
    private _isModuleResolved;
    private _isModuleResolvedAsync;
    resolveStubModuleName(from: string, moduleName: string): string | null;
    resolveStubModuleNameAsync(from: string, moduleName: string): Promise<string | null>;
}
declare type ResolverSyncObject = {
    sync: SyncResolver;
    async?: AsyncResolver;
};
declare type ResolverAsyncObject = {
    sync?: SyncResolver;
    async: AsyncResolver;
};
export declare type ResolverObject = ResolverSyncObject | ResolverAsyncObject;
export {};

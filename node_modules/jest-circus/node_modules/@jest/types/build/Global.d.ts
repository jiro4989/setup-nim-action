/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { CoverageMapData } from 'istanbul-lib-coverage';
export declare type ValidTestReturnValues = void | undefined;
declare type TestReturnValuePromise = Promise<unknown>;
declare type TestReturnValueGenerator = Generator<void, unknown, void>;
export declare type TestReturnValue = ValidTestReturnValues | TestReturnValuePromise;
export declare type TestContext = Record<string, unknown>;
export declare type DoneFn = (reason?: string | Error) => void;
export declare type DoneTakingTestFn = (this: TestContext, done: DoneFn) => ValidTestReturnValues;
export declare type PromiseReturningTestFn = (this: TestContext) => TestReturnValue;
export declare type GeneratorReturningTestFn = (this: TestContext) => TestReturnValueGenerator;
export declare type NameLike = number | Function;
export declare type TestName = string;
export declare type TestNameLike = TestName | NameLike;
export declare type TestFn = PromiseReturningTestFn | GeneratorReturningTestFn | DoneTakingTestFn;
export declare type ConcurrentTestFn = () => TestReturnValuePromise;
export declare type BlockFn = () => void;
export declare type BlockName = string;
export declare type BlockNameLike = BlockName | NameLike;
export declare type HookFn = TestFn;
export declare type Col = unknown;
export declare type Row = ReadonlyArray<Col>;
export declare type Table = ReadonlyArray<Row>;
export declare type ArrayTable = Table | Row;
export declare type TemplateTable = TemplateStringsArray;
export declare type TemplateData = ReadonlyArray<unknown>;
export declare type EachTable = ArrayTable | TemplateTable;
export declare type TestCallback = BlockFn | TestFn | ConcurrentTestFn;
export declare type EachTestFn<EachCallback extends TestCallback> = (...args: ReadonlyArray<any>) => ReturnType<EachCallback>;
interface Each<EachFn extends TestFn | BlockFn> {
    <T extends Record<string, unknown>>(table: ReadonlyArray<T>): (name: string | NameLike, fn: (arg: T) => ReturnType<EachFn>, timeout?: number) => void;
    <T extends readonly [unknown, ...Array<unknown>]>(table: ReadonlyArray<T>): (name: string | NameLike, fn: (...args: T) => ReturnType<EachFn>, timeout?: number) => void;
    <T extends readonly [unknown, ...Array<unknown>]>(table: T): (name: string | NameLike, fn: (...args: T) => ReturnType<EachFn>, timeout?: number) => void;
    <T extends ReadonlyArray<unknown>>(table: ReadonlyArray<T>): (name: string | NameLike, fn: (...args: T) => ReturnType<EachFn>, timeout?: number) => void;
    <T extends ReadonlyArray<unknown>>(table: T): (name: string | NameLike, fn: (...args: T) => ReturnType<EachFn>, timeout?: number) => void;
    <T = unknown>(strings: TemplateStringsArray, ...expressions: Array<T>): (name: string | NameLike, fn: (arg: Record<string, T>) => ReturnType<EachFn>, timeout?: number) => void;
    <T extends Record<string, unknown>>(strings: TemplateStringsArray, ...expressions: Array<unknown>): (name: string | NameLike, fn: (arg: T) => ReturnType<EachFn>, timeout?: number) => void;
}
export interface HookBase {
    (fn: HookFn, timeout?: number): void;
}
export interface Failing<T extends TestFn> {
    (testName: TestNameLike, fn: T, timeout?: number): void;
    each: Each<T>;
}
export interface ItBase {
    (testName: TestNameLike, fn: TestFn, timeout?: number): void;
    each: Each<TestFn>;
    failing: Failing<TestFn>;
}
export interface It extends ItBase {
    only: ItBase;
    skip: ItBase;
    todo: (testName: TestNameLike) => void;
}
export interface ItConcurrentBase {
    (testName: TestNameLike, testFn: ConcurrentTestFn, timeout?: number): void;
    each: Each<ConcurrentTestFn>;
    failing: Failing<ConcurrentTestFn>;
}
export interface ItConcurrentExtended extends ItConcurrentBase {
    only: ItConcurrentBase;
    skip: ItConcurrentBase;
}
export interface ItConcurrent extends It {
    concurrent: ItConcurrentExtended;
}
export interface DescribeBase {
    (blockName: BlockNameLike, blockFn: BlockFn): void;
    each: Each<BlockFn>;
}
export interface Describe extends DescribeBase {
    only: DescribeBase;
    skip: DescribeBase;
}
export interface TestFrameworkGlobals {
    it: ItConcurrent;
    test: ItConcurrent;
    fit: ItBase & {
        concurrent?: ItConcurrentBase;
    };
    xit: ItBase;
    xtest: ItBase;
    describe: Describe;
    xdescribe: DescribeBase;
    fdescribe: DescribeBase;
    beforeAll: HookBase;
    beforeEach: HookBase;
    afterEach: HookBase;
    afterAll: HookBase;
}
export interface GlobalAdditions extends TestFrameworkGlobals {
    __coverage__: CoverageMapData;
}
export interface Global extends GlobalAdditions, Omit<typeof globalThis, keyof GlobalAdditions> {
    [extras: PropertyKey]: unknown;
}
export {};

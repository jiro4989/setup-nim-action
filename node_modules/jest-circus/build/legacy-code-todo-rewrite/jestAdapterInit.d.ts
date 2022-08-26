/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { JestEnvironment } from '@jest/environment';
import { JestExpect } from '@jest/expect';
import { TestFileEvent, TestResult } from '@jest/test-result';
import type { Config, Global } from '@jest/types';
import { SnapshotState } from 'jest-snapshot';
import globals from '..';
interface RuntimeGlobals extends Global.TestFrameworkGlobals {
    expect: JestExpect;
}
export declare const initialize: ({ config, environment, globalConfig, localRequire, parentProcess, sendMessageToJest, setGlobalsForRuntime, testPath, }: {
    config: Config.ProjectConfig;
    environment: JestEnvironment;
    globalConfig: Config.GlobalConfig;
    localRequire: <T = unknown>(path: string) => T;
    testPath: string;
    parentProcess: NodeJS.Process;
    sendMessageToJest?: TestFileEvent<keyof import("@jest/test-result").TestEvents> | undefined;
    setGlobalsForRuntime: (globals: RuntimeGlobals) => void;
}) => Promise<{
    globals: Global.TestFrameworkGlobals;
    snapshotState: SnapshotState;
}>;
export declare const runAndTransformResultsToJestFormat: ({ config, globalConfig, testPath, }: {
    config: Config.ProjectConfig;
    globalConfig: Config.GlobalConfig;
    testPath: string;
}) => Promise<TestResult>;
export {};

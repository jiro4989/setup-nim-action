/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" />
import { ChildMessage, OnCustomMessage, OnEnd, OnStart, WorkerInterface, WorkerOptions } from '../types';
import WorkerAbstract from './WorkerAbstract';
export default class ExperimentalWorker extends WorkerAbstract implements WorkerInterface {
    private _worker;
    private _options;
    private _request;
    private _retries;
    private _onProcessEnd;
    private _onCustomMessage;
    private _stdout;
    private _stderr;
    private _memoryUsagePromise;
    private _resolveMemoryUsage;
    private _childWorkerPath;
    private _childIdleMemoryUsage;
    private _childIdleMemoryUsageLimit;
    private _memoryUsageCheck;
    constructor(options: WorkerOptions);
    initialize(): void;
    private _onError;
    private _onMessage;
    private _onExit;
    waitForExit(): Promise<void>;
    forceExit(): void;
    send(request: ChildMessage, onProcessStart: OnStart, onProcessEnd: OnEnd | null, onCustomMessage: OnCustomMessage): void;
    getWorkerId(): number;
    getStdout(): NodeJS.ReadableStream | null;
    getStderr(): NodeJS.ReadableStream | null;
    private _performRestartIfRequired;
    /**
     * Gets the last reported memory usage.
     *
     * @returns Memory usage in bytes.
     */
    getMemoryUsage(): Promise<number | null>;
    /**
     * Gets updated memory usage and restarts if required
     */
    checkMemoryUsage(): void;
    /**
     * Gets the thread id of the worker.
     *
     * @returns Thread id.
     */
    getWorkerSystemId(): number;
    isWorkerRunning(): boolean;
}

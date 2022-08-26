/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" />
import { ChildMessage, OnCustomMessage, OnEnd, OnStart, WorkerInterface, WorkerOptions } from '../types';
import WorkerAbstract from './WorkerAbstract';
export declare const SIGKILL_DELAY = 500;
/**
 * This class wraps the child process and provides a nice interface to
 * communicate with. It takes care of:
 *
 *  - Re-spawning the process if it dies.
 *  - Queues calls while the worker is busy.
 *  - Re-sends the requests if the worker blew up.
 *
 * The reason for queueing them here (since childProcess.send also has an
 * internal queue) is because the worker could be doing asynchronous work, and
 * this would lead to the child process to read its receiving buffer and start a
 * second call. By queueing calls here, we don't send the next call to the
 * children until we receive the result of the previous one.
 *
 * As soon as a request starts to be processed by a worker, its "processed"
 * field is changed to "true", so that other workers which might encounter the
 * same call skip it.
 */
export default class ChildProcessWorker extends WorkerAbstract implements WorkerInterface {
    private _child;
    private _options;
    private _request;
    private _retries;
    private _onProcessEnd;
    private _onCustomMessage;
    private _stdout;
    private _stderr;
    private _stderrBuffer;
    private _memoryUsagePromise;
    private _resolveMemoryUsage;
    private _childIdleMemoryUsage;
    private _childIdleMemoryUsageLimit;
    private _memoryUsageCheck;
    private _childWorkerPath;
    constructor(options: WorkerOptions);
    initialize(): void;
    private stderrDataHandler;
    private _detectOutOfMemoryCrash;
    private _onDisconnect;
    private _onMessage;
    private _performRestartIfRequired;
    private _onExit;
    send(request: ChildMessage, onProcessStart: OnStart, onProcessEnd: OnEnd, onCustomMessage: OnCustomMessage): void;
    waitForExit(): Promise<void>;
    killChild(): NodeJS.Timeout;
    forceExit(): void;
    getWorkerId(): number;
    /**
     * Gets the process id of the worker.
     *
     * @returns Process id.
     */
    getWorkerSystemId(): number;
    getStdout(): NodeJS.ReadableStream | null;
    getStderr(): NodeJS.ReadableStream | null;
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
    isWorkerRunning(): boolean;
}

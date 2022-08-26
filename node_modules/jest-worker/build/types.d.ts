/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import type { ForkOptions } from 'child_process';
import type { EventEmitter } from 'events';
import type { ResourceLimits } from 'worker_threads';
declare type ReservedKeys = 'end' | 'getStderr' | 'getStdout' | 'setup' | 'teardown';
declare type ExcludeReservedKeys<K> = Exclude<K, ReservedKeys>;
declare type FunctionLike = (...args: any) => unknown;
declare type MethodLikeKeys<T> = {
    [K in keyof T]: T[K] extends FunctionLike ? K : never;
}[keyof T];
declare type Promisify<T extends FunctionLike> = ReturnType<T> extends Promise<infer R> ? (...args: Parameters<T>) => Promise<R> : (...args: Parameters<T>) => Promise<ReturnType<T>>;
export declare type WorkerModule<T> = {
    [K in keyof T as Extract<ExcludeReservedKeys<K>, MethodLikeKeys<T>>]: T[K] extends FunctionLike ? Promisify<T[K]> : never;
};
export declare const CHILD_MESSAGE_INITIALIZE = 0;
export declare const CHILD_MESSAGE_CALL = 1;
export declare const CHILD_MESSAGE_END = 2;
export declare const CHILD_MESSAGE_MEM_USAGE = 3;
export declare const PARENT_MESSAGE_OK = 0;
export declare const PARENT_MESSAGE_CLIENT_ERROR = 1;
export declare const PARENT_MESSAGE_SETUP_ERROR = 2;
export declare const PARENT_MESSAGE_CUSTOM = 3;
export declare const PARENT_MESSAGE_MEM_USAGE = 4;
export declare type PARENT_MESSAGE_ERROR = typeof PARENT_MESSAGE_CLIENT_ERROR | typeof PARENT_MESSAGE_SETUP_ERROR;
export declare type WorkerCallback = (workerId: number, request: ChildMessage, onStart: OnStart, onEnd: OnEnd, onCustomMessage: OnCustomMessage) => void;
export interface WorkerPoolInterface {
    getStderr(): NodeJS.ReadableStream;
    getStdout(): NodeJS.ReadableStream;
    getWorkers(): Array<WorkerInterface>;
    createWorker(options: WorkerOptions): WorkerInterface;
    send: WorkerCallback;
    end(): Promise<PoolExitResult>;
}
export interface WorkerInterface {
    get state(): WorkerStates;
    send(request: ChildMessage, onProcessStart: OnStart, onProcessEnd: OnEnd, onCustomMessage: OnCustomMessage): void;
    waitForExit(): Promise<void>;
    forceExit(): void;
    getWorkerId(): number;
    getStderr(): NodeJS.ReadableStream | null;
    getStdout(): NodeJS.ReadableStream | null;
    /**
     * Some system level identifier for the worker. IE, process id, thread id, etc.
     */
    getWorkerSystemId(): number;
    getMemoryUsage(): Promise<number | null>;
    /**
     * Checks to see if the child worker is actually running.
     */
    isWorkerRunning(): boolean;
    /**
     * When the worker child is started and ready to start handling requests.
     *
     * @remarks
     * This mostly exists to help with testing so that you don't check the status
     * of things like isWorkerRunning before it actually is.
     */
    waitForWorkerReady(): Promise<void>;
}
export declare type PoolExitResult = {
    forceExited: boolean;
};
export interface PromiseWithCustomMessage<T> extends Promise<T> {
    UNSTABLE_onCustomMessage?: (listener: OnCustomMessage) => () => void;
}
export interface TaskQueue {
    /**
     * Enqueues the task in the queue for the specified worker or adds it to the
     * queue shared by all workers
     * @param task the task to queue
     * @param workerId the id of the worker that should process this task or undefined
     * if there's no preference.
     */
    enqueue(task: QueueChildMessage, workerId?: number): void;
    /**
     * Dequeues the next item from the queue for the specified worker
     * @param workerId the id of the worker for which the next task should be retrieved
     */
    dequeue(workerId: number): QueueChildMessage | null;
}
export declare type WorkerSchedulingPolicy = 'round-robin' | 'in-order';
export declare type WorkerFarmOptions = {
    computeWorkerKey?: (method: string, ...args: Array<unknown>) => string | null;
    enableWorkerThreads?: boolean;
    exposedMethods?: ReadonlyArray<string>;
    forkOptions?: ForkOptions;
    maxRetries?: number;
    numWorkers?: number;
    resourceLimits?: ResourceLimits;
    setupArgs?: Array<unknown>;
    taskQueue?: TaskQueue;
    WorkerPool?: new (workerPath: string, options?: WorkerPoolOptions) => WorkerPoolInterface;
    workerSchedulingPolicy?: WorkerSchedulingPolicy;
    idleMemoryLimit?: number;
};
export declare type WorkerPoolOptions = {
    setupArgs: Array<unknown>;
    forkOptions: ForkOptions;
    resourceLimits: ResourceLimits;
    maxRetries: number;
    numWorkers: number;
    enableWorkerThreads: boolean;
    idleMemoryLimit?: number;
};
export declare type WorkerOptions = {
    forkOptions: ForkOptions;
    resourceLimits: ResourceLimits;
    setupArgs: Array<unknown>;
    maxRetries: number;
    workerId: number;
    workerData?: unknown;
    workerPath: string;
    /**
     * After a job has executed the memory usage it should return to.
     *
     * @remarks
     * Note this is different from ResourceLimits in that it checks at idle, after
     * a job is complete. So you could have a resource limit of 500MB but an idle
     * limit of 50MB. The latter will only trigger if after a job has completed the
     * memory usage hasn't returned back down under 50MB.
     */
    idleMemoryLimit?: number;
    /**
     * This mainly exists so the path can be changed during testing.
     * https://github.com/facebook/jest/issues/9543
     */
    childWorkerPath?: string;
    /**
     * This is useful for debugging individual tests allowing you to see
     * the raw output of the worker.
     */
    silent?: boolean;
    /**
     * Used to immediately bind event handlers.
     */
    on?: {
        [WorkerEvents.STATE_CHANGE]: OnStateChangeHandler | ReadonlyArray<OnStateChangeHandler>;
    };
};
export declare type OnStateChangeHandler = (state: WorkerStates, oldState: WorkerStates) => void;
export declare type MessagePort = typeof EventEmitter & {
    postMessage(message: unknown): void;
};
export declare type MessageChannel = {
    port1: MessagePort;
    port2: MessagePort;
};
export declare type ChildMessageInitialize = [
    typeof CHILD_MESSAGE_INITIALIZE,
    boolean,
    string,
    // file
    Array<unknown> | undefined,
    // setupArgs
    MessagePort | undefined
];
export declare type ChildMessageCall = [
    typeof CHILD_MESSAGE_CALL,
    boolean,
    string,
    Array<unknown>
];
export declare type ChildMessageEnd = [
    typeof CHILD_MESSAGE_END,
    boolean
];
export declare type ChildMessageMemUsage = [
    typeof CHILD_MESSAGE_MEM_USAGE
];
export declare type ChildMessage = ChildMessageInitialize | ChildMessageCall | ChildMessageEnd | ChildMessageMemUsage;
export declare type ParentMessageCustom = [
    typeof PARENT_MESSAGE_CUSTOM,
    unknown
];
export declare type ParentMessageOk = [
    typeof PARENT_MESSAGE_OK,
    unknown
];
export declare type ParentMessageMemUsage = [
    typeof PARENT_MESSAGE_MEM_USAGE,
    number
];
export declare type ParentMessageError = [
    PARENT_MESSAGE_ERROR,
    string,
    string,
    string,
    unknown
];
export declare type ParentMessage = ParentMessageOk | ParentMessageError | ParentMessageCustom | ParentMessageMemUsage;
export declare type OnStart = (worker: WorkerInterface) => void;
export declare type OnEnd = (err: Error | null, result: unknown) => void;
export declare type OnCustomMessage = (message: Array<unknown> | unknown) => void;
export declare type QueueChildMessage = {
    request: ChildMessageCall;
    onStart: OnStart;
    onEnd: OnEnd;
    onCustomMessage: OnCustomMessage;
};
export declare enum WorkerStates {
    STARTING = "starting",
    OK = "ok",
    OUT_OF_MEMORY = "oom",
    RESTARTING = "restarting",
    SHUTTING_DOWN = "shutting-down",
    SHUT_DOWN = "shut-down"
}
export declare enum WorkerEvents {
    STATE_CHANGE = "state-change"
}
export {};

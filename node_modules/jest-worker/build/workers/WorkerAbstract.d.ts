/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter, PassThrough } from 'stream';
import { WorkerInterface, WorkerOptions, WorkerStates } from '../types';
export default abstract class WorkerAbstract extends EventEmitter implements Pick<WorkerInterface, 'waitForWorkerReady' | 'state'> {
    #private;
    protected _fakeStream: PassThrough | null;
    protected _exitPromise: Promise<void>;
    protected _resolveExitPromise: () => void;
    protected _workerReadyPromise: Promise<void> | undefined;
    protected _resolveWorkerReady: (() => void) | undefined;
    get state(): WorkerStates;
    protected set state(value: WorkerStates);
    constructor(options: WorkerOptions);
    /**
     * Wait for the worker child process to be ready to handle requests.
     *
     * @returns Promise which resolves when ready.
     */
    waitForWorkerReady(): Promise<void>;
    /**
     * Used to shut down the current working instance once the children have been
     * killed off.
     */
    protected _shutdown(): void;
    protected _getFakeStream(): PassThrough;
}

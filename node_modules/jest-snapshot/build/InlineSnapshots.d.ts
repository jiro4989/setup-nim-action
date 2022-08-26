/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Expression } from '@babel/types';
import type { Frame } from 'jest-message-util';
export declare type InlineSnapshot = {
    snapshot: string;
    frame: Frame;
    node?: Expression;
};
export declare function saveInlineSnapshots(snapshots: Array<InlineSnapshot>, rootDir: string, prettierPath: string | null): void;

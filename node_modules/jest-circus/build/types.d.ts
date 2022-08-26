/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { Circus } from '@jest/types';
export declare const STATE_SYM: unique symbol;
export declare const RETRY_TIMES: unique symbol;
export declare const TEST_TIMEOUT_SYMBOL: unique symbol;
export declare const LOG_ERRORS_BEFORE_RETRY: unique symbol;
declare global {
    namespace NodeJS {
        interface Global {
            [STATE_SYM]: Circus.State;
            [RETRY_TIMES]: string;
            [TEST_TIMEOUT_SYMBOL]: number;
            [LOG_ERRORS_BEFORE_RETRY]: boolean;
        }
    }
}

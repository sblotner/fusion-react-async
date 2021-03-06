/** Copyright (c) 2018 Uber Technologies, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-env node */

process.on('unhandledRejection', e => {
  throw e;
});
import './__node__/prepare-render.node.js';
import './__node__/prepare-context.node.js';
import './__node__/split.node.js';

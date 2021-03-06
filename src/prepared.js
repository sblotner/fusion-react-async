/** Copyright (c) 2018 Uber Technologies, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {Component} from 'react';

import {REACT_PREPARE} from './constants';

const prepared = (prepare, opts = {}) => OriginalComponent => {
  opts = Object.assign(
    {
      boundary: false,
      defer: false,
      componentDidMount: true,
      componentWillReceiveProps: true,
      contextTypes: {},
      forceUpdate: false,
    },
    opts
  );
  class PreparedComponent extends Component {
    componentDidMount() {
      if (opts.componentDidMount) {
        Promise.resolve(prepare(this.props, this.context)).then(() => {
          if (opts.forceUpdate) {
            this.forceUpdate(); // TODO(#10) document
          }
        });
      }
    }

    // // TODO(#5): Figure out if we want to run prepare on componentWillReceiveProps
    // componentWillReceiveProps(nextProps, nextContext) {
    //   if (componentWillReceiveProps) {
    //     prepare(nextProps, nextContext);
    //   }
    // }

    render() {
      return <OriginalComponent {...this.props} />;
    }
  }

  const displayName =
    OriginalComponent.displayName || OriginalComponent.name || '';
  PreparedComponent.contextTypes = opts.contextTypes;
  PreparedComponent.displayName = `PreparedComponent(${displayName})`;
  PreparedComponent[REACT_PREPARE] = {
    prepare: (...args) => Promise.resolve(prepare(...args)),
    defer: opts.defer,
  };

  return PreparedComponent;
};

function isPrepared(CustomComponent) {
  return (
    CustomComponent[REACT_PREPARE] &&
    typeof CustomComponent[REACT_PREPARE].prepare === 'function'
  );
}

function getPrepare(CustomComponent) {
  return CustomComponent[REACT_PREPARE] || {};
}

export {isPrepared, getPrepare};
export default prepared;

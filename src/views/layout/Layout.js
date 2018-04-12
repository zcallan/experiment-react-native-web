import React, { Component, Fragment } from 'react';


class Layout extends Component {
  render() {
    const { children } = this.props;

    return (
      <Fragment>
        {children}
      </Fragment>
    )
  }
}

export default Layout;

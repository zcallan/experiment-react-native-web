import React, { Component } from 'react';
import { withNavigation } from 'react-navigation';
import { string } from 'prop-types';

class Redirect extends Component {
  componentDidMount() {
    const { navigation, to } = this.props;

    navigation.replace( to );
  }

  render() {
    return null;
  }
}

Redirect.propTypes = {
  to: string.isRequired,
};

export default withNavigation( Redirect );

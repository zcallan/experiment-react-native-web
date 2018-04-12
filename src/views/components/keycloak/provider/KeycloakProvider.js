import React, { Component } from 'react';
import KeycloakContext from '../context';

class KeycloakProvider extends Component {
  authSuccess = () => {
    this.setState({ authenticated: true });
  }

  authAttempt = () => {
    console.log( 'attempting auth...' );
  }

  state = {
    authenticated: false,
    token: null,
    error: null,
    authSuccess: this.authSuccess,
    authAttempt: this.authAttempt,
  }

  render() {
    return (
      <KeycloakContext.Provider value={this.state}>
        {this.props.children}
      </KeycloakContext.Provider>
    );
  }
}

export default KeycloakProvider;

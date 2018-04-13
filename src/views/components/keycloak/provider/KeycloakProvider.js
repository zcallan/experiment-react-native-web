import React, { Component } from 'react';
import KeycloakContext from '../context';

class KeycloakProvider extends Component {
  authSuccess = () => {
    this.setState({ authenticated: true });
  }

  authAttempt = () => {
    if ( this.state.authenticated ) return;

    this.setState({ authenticating: true });
  }

  state = {
    authenticating: false,
    authenticated: true,
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

import React, { Component } from 'react';
import { Text, Button, Link, Box, KeycloakContext, Redirect } from '../../components';
import Layout from '../../layout';

class Login extends Component {
  componentDidMount() {
    this.props.keycloak.authAttempt();
  }

  render() {
    const { authenticated, authenticating } = this.props.keycloak;

    if ( authenticated )
      return <Redirect to="home" />;

    return (
      <Layout>
        <Box justifyContent="center" alignItems="center" height="100%">
          <Text>Logging you in...</Text>
        </Box>
      </Layout>
    );
  }
}

export default props => (
  <KeycloakContext.Consumer>
    {keycloak => (
      <Login {...props} keycloak={keycloak} />
    )}
  </KeycloakContext.Consumer>
);

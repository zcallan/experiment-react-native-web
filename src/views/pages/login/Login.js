import React, { Component } from 'react';
import { Text, Button, Link, Box, KeycloakConsumer, Redirect } from '../../components';
import Layout from '../../layout';

class Login extends Component {
  componentDidMount() {
    this.doLogin();
  }

  doLogin() {
    this.props.keycloak.attemptLogin();
  }

  render() {
    const { isAuthenticated, error } = this.props.keycloak;

    if ( isAuthenticated )
      return <Redirect to="home" />;

    if ( error )
      return <Text>{error}</Text>;

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
  <KeycloakConsumer>
    {keycloak => (
      <Login {...props} keycloak={keycloak} />
    )}
  </KeycloakConsumer>
);

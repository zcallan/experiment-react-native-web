import React, { Component } from 'react';
import { Text, Button, Link, Box, KeycloakConsumer, Redirect } from '../../components';
import Layout from '../../layout';

class Logout extends Component {
  componentDidMount() {
    this.doLogout();
  }

  doLogout() {
    this.props.keycloak.attemptLogout();
  }

  render() {
    const { isAuthenticated, error } = this.props.keycloak;

    if ( error )
      return <Text>An error has occurred!</Text>;

    return (
      <Layout>
        <Box justifyContent="center" alignItems="center" height="100%">
          <Text>Logging you out...</Text>
        </Box>
      </Layout>
    );
  }
}

export default props => (
  <KeycloakConsumer>
    {keycloak => (
      <Logout {...props} keycloak={keycloak} />
    )}
  </KeycloakConsumer>
);

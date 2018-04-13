import React, { Component } from 'react';
import { Text, Button, Link, Box, KeycloakConsumer, Redirect } from '../../components';
import Layout from '../../layout';

class Logout extends Component {
  componentDidMount() {
    this.props.keycloak.attemptLogout();
  }

  render() {
    const { isAuthenticated } = this.props.keycloak;

    if ( !isAuthenticated )
      return <Redirect to="home" />;

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

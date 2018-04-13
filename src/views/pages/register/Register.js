import React, { Component } from 'react';
import { Text, Button, Link, Box, KeycloakConsumer, Redirect } from '../../components';
import Layout from '../../layout';

class Register extends Component {
  componentDidMount() {
    this.props.keycloak.attemptRegister();
  }

  render() {
    const { isAuthenticated } = this.props.keycloak;

    if ( isAuthenticated )
      return <Redirect to="home" />;

    return (
      <Layout>
        <Box justifyContent="center" alignItems="center" height="100%">
          <Text>Preparing to register...</Text>
        </Box>
      </Layout>
    );
  }
}

export default props => (
  <KeycloakConsumer>
    {keycloak => (
      <Register {...props} keycloak={keycloak} />
    )}
  </KeycloakConsumer>
);

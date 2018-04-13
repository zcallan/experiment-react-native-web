import React, { Component } from 'react';
import { Text, Button, Link, Box, KeycloakConsumer, Redirect } from '../../components';
import Layout from '../../layout';

class Register extends Component {
  componentDidMount() {
    this.doRegister();
  }

  doRegister() {
    this.props.keycloak.attemptRegister();
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

import React, { Component, Fragment } from 'react';
import { Text, Button, Link, Box, KeycloakConsumer } from '../../components';
import Layout from '../../layout';

class Home extends Component {
  render() {
    return (
      <KeycloakConsumer>
        {({ isAuthenticated }) => (
          <Layout>
            <Box justifyContent="center" alignItems="center" height="100%">
              <Text>Home</Text>

              {isAuthenticated ? (
                <Link href="logout">
                  <Button color="red">
                    Logout
                  </Button>
                </Link>
              ) : (
                <Fragment>
                  <Link href="login">
                    <Button color="red">
                      Login
                    </Button>
                  </Link>

                  <Link href="register">
                    <Button color="white">
                      Register
                    </Button>
                  </Link>
                </Fragment>
              )}
            </Box>
          </Layout>
        )}
      </KeycloakConsumer>
    );
  }
}

export default Home;

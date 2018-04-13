import React, { Component } from 'react';
import { Text, Button, Link, Box } from '../../components';
import Layout from '../../layout';

class Home extends Component {
  render() {
    return (
      <Layout>
        <Box justifyContent="center" alignItems="center" height="100%">
          <Text>Home</Text>

          <Link href="login">
            <Button color="red">
              Login
            </Button>
          </Link>
        </Box>
      </Layout>
    );
  }
}

export default Home;

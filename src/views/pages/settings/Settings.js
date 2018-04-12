import React, { Component } from 'react';
import { Text, Link, Button, Box } from '../../components';
import Layout from '../../layout';

class Settings extends Component {
  render() {
    return (
      <Layout>
        <Box justifyContent="center" alignItems="center" height="100%">
          <Text>Settings</Text>

          <Link href="home">
            <Button color="red">
              Home
            </Button>
          </Link>
        </Box>
      </Layout>
    );
  }
}

export default Settings;

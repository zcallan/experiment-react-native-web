import styles from './Home.scss';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Text, Button, Link } from '../../components';
import Layout from '../../layout';

class Home extends Component {
  render() {
    console.log( 'render' );
    return (
      <Layout>
        <View className={styles.wrapper}>
          <Text>Home</Text>

          <Link href="settings">
            <Button color="red">
              Settings
            </Button>
          </Link>
        </View>
      </Layout>
    );
  }
}

export default Home;

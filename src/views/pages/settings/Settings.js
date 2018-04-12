import styles from './Settings.scss';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Text, Link, Button } from '../../components';
import Layout from '../../layout';

class Settings extends Component {
  render() {
    return (
      <Layout>
        <View className={styles.wrapper}>
          <Text>Settings</Text>

          <Link href="home">
            <Button color="red">
              Home
            </Button>
          </Link>
        </View>
      </Layout>
    );
  }
}

export default Settings;

import styles from './Home.scss';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Text } from '../../components';
import Layout from '../../layout';

class Home extends Component {
  render() {
    return (
      <Layout>
        <View className={styles.wrapper}>
          <Text>Home</Text>
        </View>
      </Layout>
    );
  }
}

export default Home;

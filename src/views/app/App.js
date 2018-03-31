import React, { Component } from 'react';
import { Text, View } from 'react-native';
import styles from './App.css';
import { Button } from '../components';


class App extends Component {
  handleClick = () => {
    alert( 'hi!' );
  }

  render() {
    return (
      <View className={styles.wrapper}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>

        <Button onClick={this.handleClick}>Hello!</Button>
      </View>
    );
  }
}

export default App;

import styles from './Text.css';
import React from 'react';
import { Text as NativeText } from 'react-native';
import { string, oneOf, oneOfType, number, object } from 'prop-types';


const Text = ({
  children,
  color = 'black',
  ...restProps
}) => {
  return (
    <NativeText
      className={styles[color]}
    >
      {children}
    </NativeText>
  );
};

Text.propTypes = {
  children: string,
  color: oneOf(
    ['darkGrey', 'grey', 'white', 'black']
  ),
  margin: number,
  marginVertical: number,
};

export default Text;

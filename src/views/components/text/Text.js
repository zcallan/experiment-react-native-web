import styles from './Text.scss';
import React from 'react';
import { Text as NativeText } from 'react-native';
import { string, oneOf, oneOfType, number, object } from 'prop-types';


const Text = ({
  children,
  color = 'black',
  className,
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
  styleName: string,
  children: string,
  color: oneOf(
    ['darkGrey', 'grey', 'white', 'black']
  ),
  margin: number,
  style: object,
  marginVertical: number,
};

export default Text;

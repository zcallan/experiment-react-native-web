import React from 'react';
import { TouchableOpacity } from 'react-native';
import { string, bool, oneOf, func } from 'prop-types';
import styles from './Button.css';
import { Text } from '../index';


const Button = ({
  children = 'Button',
  color = 'blue',
  disabled,
  onClick = onPress,
  onPress,
  ...restProps
}) => {
  const textColors = {
    red: 'white',
    blue: 'white',
    grey: 'darkGrey',
    white: 'darkGrey',
  };

  return (
    <TouchableOpacity
      {...restProps}
      disabled={disabled}
      onPress={onPress}
      className={[styles.wrapper, styles[color]].join( ' ' )}
    >
      <Text
        color={disabled ? 'grey' : textColors[color]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

Button.propTypes = {
  children: string,
  color: oneOf(
    ['red', 'blue', 'grey', 'white']
  ).isRequired,
  disabled: bool,
  onClick: func,
};

export default Button;

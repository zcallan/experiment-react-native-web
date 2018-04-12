import React from 'react';
import { TouchableOpacity } from 'react-native';
import { string, bool, oneOf, func } from 'prop-types';
import styles from './Button.css';
import { Text } from '../index';


const Button = ({
  children = 'Button',
  color = 'blue',
  disabled,
  onClick,
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
      onPress={onClick}
      className={styles.wrapper}
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

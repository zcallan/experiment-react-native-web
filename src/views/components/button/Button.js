import React from 'react';
import { Button as NativeButton } from 'react-native';
import { string, func } from 'prop-types';


const Button = ({
  children = 'Button',
  onClick,
}) => (
  <NativeButton
    title={children}
    onPress={onClick}
  />
);

Button.propTypes = {
  children: string,
  onClick: func.isRequired,
};

export default Button;

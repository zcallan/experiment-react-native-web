import React from 'react';
import { View } from 'react-native';
import { oneOf, any } from 'prop-types';


const Box = ({
  justifyContent = 'flex-start',
  alignItems = 'flex-start',
  height = 'auto',
  width = 'auto',
  children,
  style = {},
  className,
  ...restProps
}) => {
  /* TODO revise for better way to pass styling, especially as CSS. */
  const styles = {
    justifyContent,
    alignItems,
    height,
    width,
    ...style,
  };

  return (
    <View
      {...restProps}
      className={className}
      style={styles}
    >
      {children}
    </View>
  );
};

Box.propTypes = {
  children: any,
  justifyContent: oneOf(
    ['flex-start', 'flex-end', 'center', 'space-between', 'space-around']
  ),
  alignItems: oneOf(
    ['flex-start', 'flex-end', 'center', 'space-between', 'space-around']
  ),
};

export default Box;

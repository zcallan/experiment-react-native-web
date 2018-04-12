import React, { cloneElement } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { withNavigation } from 'react-navigation';
import { string, bool, oneOf, func } from 'prop-types';


const Link = ({
  children = 'Link',
  href,
  disabled,
  onClick,
  navigation,
  ...restProps
}) => {
  const handlePress = event => {
    navigation.navigate( href );

    console.log( 'pressed' );

    if ( onClick )
      onClick( event );
  }

  return (
    <TouchableWithoutFeedback
      onPress={handlePress}
    >
      {cloneElement( children, {
        onPress: handlePress,
      })}
    </TouchableWithoutFeedback>
  );
};

Link.propTypes = {
  children: string,
  color: oneOf(
    ['red', 'blue', 'grey', 'white']
  ).isRequired,
  disabled: bool,
  onClick: func,
};

export default withNavigation( Link );

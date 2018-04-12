import React, { cloneElement } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { withNavigation } from 'react-navigation';
import { any, bool, func, string } from 'prop-types';


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
  children: any,
  href: string,
  disabled: bool,
  onClick: func,
};

export default withNavigation( Link );

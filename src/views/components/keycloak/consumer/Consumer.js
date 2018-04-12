import React from 'react';
import { KeycloakContext } from '../../../../utils';

const KeycloakConsumer = ({ children }) => {
  return (
    <KeycloakContext.Consumer>
      {state => children( state )}
    </KeycloakContext.Consumer>
  );
};

export default KeycloakConsumer;

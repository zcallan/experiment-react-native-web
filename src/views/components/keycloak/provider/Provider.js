import React from 'react';
import { KeycloakContext } from '../../../../utils';

const KeycloakProvider = ({ children }) => {
  return (
    <KeycloakContext.Provider>
      {children}
    </KeycloakContext.Provider>
  );
};

export default KeycloakProvider;

import React from 'react';
import App from './views/app';
import { KeycloakProvider } from './views/components';

const Root = () => (
  <KeycloakProvider>
    <App />
  </KeycloakProvider>
);

export default Root;

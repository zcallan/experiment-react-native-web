import React, { createContext } from 'react';

const initialState = {
  authenticated: false,
  token: null,
};

export default createContext( initialState );

import React, { Component } from 'react';
import { string } from 'prop-types';
import { Linking } from 'react-native';
import queryString from 'query-string';
import { WebBrowser, Constants } from 'expo';
import uuid from 'uuid/v4';
import KeycloakContext from '../context';

class KeycloakProvider extends Component {
  createRealmUrl() {
    const { baseUrl, realm } = this.props;
    const encodedRealm = encodeURIComponent( realm );

    return `${baseUrl}/auth/realms/${encodedRealm}`;
  }

  createActionUrl = ( action, query = {}) => {
    const realmUrl = this.createRealmUrl();    
    const uniqueIdentifier = uuid();

    const {
      response_type = 'code',
      redirect_uri = Constants.linkingUri,
      client_id = this.props.clientId,
      state = uniqueIdentifier,
    } = query;
    
    const stringifiedQuery = queryString.stringify({
      response_type, redirect_uri, client_id, state,
    });

    this.setState({ sessionState: uniqueIdentifier });
    
    return `${realmUrl}/protocol/openid-connect/${action}?${stringifiedQuery}`;
  }

  createLoginUrl = options => {
    return this.createActionUrl( 'auth', options );
  }

  createRegisterUrl = options => {
    return this.createActionUrl( 'registrations', options );
  }

  handleAuthSuccess = code => {
    this.setState({
      isAuthenticated: true,
      refreshToken: code,
    });

    this.startTokenRefresh();

    if ( this.state.promise ) {
      this.state.promise.resolve();

      this.setState({ promise: null });
    }
  }

  attemptLogin = () => {
    if ( this.state.isAuthenticated ) return;

    const loginUrl = this.createLoginUrl();
    
    this.setState({ isAuthenticating: true });

    Linking.addEventListener( 'url', this.handleUrlChange );

    WebBrowser.openAuthSessionAsync( loginUrl );

    return new Promise(( resolve, reject ) => {
      this.setState({ promise: { resolve, reject }});
    });
  }

  attemptRegister = () => {
    if ( this.state.isAuthenticated ) return;

    const registerUrl = this.createRegisterUrl();
    
    this.setState({ isRegistering: true });

    Linking.addEventListener( 'url', this.handleUrlChange );

    WebBrowser.openAuthSessionAsync( registerUrl );

    return new Promise(( resolve, reject ) => {
      this.setState({ promise: { resolve, reject }});
    });
  }

  attemptLogout = () => {
    if ( !this.state.isAuthenticated ) return;

    return new Promise(( resolve ) => {
      this.setState({
        isAuthenticated: false,
        token: null,
        refreshToken: null,
        sessionState: null,
      }, resolve );
    });
  }

  state = {
    isAuthenticated: false,
    isAuthenticating: false,
    isRegistering: false,
    accessToken: null,
    refreshToken: null,    
    sessionState: null,    
    error: null,
    attemptLogin: this.attemptLogin,
    attemptRegister: this.attemptRegister,
    attemptLogout: this.attemptLogout,
  }

  componentWillUnmount() {
    Linking.removeEventListener( 'url', this.handleUrlChange );
  }

  startTokenRefresh() {
    this.handleTokenRefresh();

    this.setState({
      refreshTimer: setInterval( this.handleTokenRefresh, 30000 ), // 30 seconds
    });
  }

  handleTokenRefresh = async () => {
    const realmUrl = this.createRealmUrl();
    const url = `${realmUrl}/protocol/openid-connect/token`;
    const uniqueIdentifier = uuid();
    const { refreshToken, sessionState } = this.state;
    const { clientId } = this.props;

    this.setState({ sessionState: uniqueIdentifier });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: queryString.stringify({
        grant_type: 'authorization_code',
        redirect_uri: Constants.linkingUri,
        client_id: clientId,
        code: refreshToken,
        state: uniqueIdentifier,
      }),
    };

    const response = await fetch( url, options );
    const responseJson = await response.json();

    if (
      responseJson &&
      responseJson.token &&
      responseJson.session_state &&
      responseJson.session_state === sessionState
    ) {
      this.handleTokenRefreshSuccess( responseJson );
    }
    else {
      this.handleError( responseJson );
    }
  }

  handleTokenRefreshSuccess = ({ access_token, refresh_token }) => {
    this.setState({
      refreshToken: refresh_token,
      accessToken: access_token,
    });
  }

  handleError = error => {
    this.setState({ error });

    if ( this.state.promise ) {
      this.state.promise.reject( error );

      this.setState({ promise: null });
    }
  }

  handleUrlChange = event => {
    console.log( event );
    const { url } = event;
    const appUrl = Constants.linkingUri;

    if ( url.startsWith( appUrl )) {
      WebBrowser.dismissBrowser();

      Linking.removeEventListener( 'url', this.handleUrlChange );

      this.handleUrlDecoding( url );
    }
  }

  handleUrlDecoding = url => {
    const { sessionState } = this.state;
    const { query } = queryString.parseUrl( url );

    if (
      query &&
      query.state &&
      query.state === sessionState &&
      query.code
    ) {
      this.handleAuthSuccess( query.code );
    }
    else {
      this.handleError( 'Unable to decode keycloak URL after returning from auth screen.' );
    }
  }

  render() {
    return (
      <KeycloakContext.Provider value={this.state}>
        {this.props.children}
      </KeycloakContext.Provider>
    );
  }
}

KeycloakProvider.propTypes = {

};

export default KeycloakProvider;

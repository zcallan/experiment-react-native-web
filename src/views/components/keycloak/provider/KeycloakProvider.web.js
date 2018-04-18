import React, { Component } from 'react';
import { Platform } from 'react-native';
import { string } from 'prop-types';
import queryString from 'query-string';
import uuid from 'uuid/v4';
import keycloak from './keycloak';
import KeycloakContext from '../context';
import { Url, Storage } from '../../../../utils';

class KeycloakProvider extends Component {
  attemptLogin = () => {
    if ( this.state.isAuthenticated ) return;

    const LoginUrl = this.createLoginUrl();

    LoginUrl.open();

    this.setState({
      isAuthenticating: true,
      error: null,
    });

    return new Promise(( resolve, reject ) => {
      this.setState({ promise: { resolve, reject }});
    });
  }

  attemptRegister = () => {
    if ( this.state.isAuthenticated ) return;

    const registerUrl = this.createRegisterUrl();

    this.setState({
      isRegistering: true,
      error: null,
    });

    window.location.href = registerUrl;

    return new Promise(( resolve, reject ) => {
      this.setState({ promise: { resolve, reject }});
    });
  }

  attemptLogout = async () => {
    if ( !this.state.isAuthenticated ) return;

    const logoutUrl = this.createLogoutUrl();

    if ( this.state.refreshTimer )
      clearInterval( this.state.refreshTimer );

    await this.asyncSetState({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      sessionState: null,
      sessionNonce: null,
      error: null,
    });

    localStorage.removeItem( 'kcSessionState' );
    localStorage.removeItem( 'kcSessionNonce' );
    localStorage.removeItem( 'kcAuth' );

    window.location.href = logoutUrl;

    return new Promise(( resolve, reject ) => {
      this.setState({ promise: { resolve, reject }});
    });
  }

  state = {
    isAuthenticated: false,
    isAuthenticating: false,
    isRegistering: false,
    accessToken: null,
    refreshToken: null,
    refreshTimer: null,
    sessionState: null,
    sessionNonce: null,
    error: null,
    isFetchingToken: false,
    attemptLogin: this.attemptLogin,
    attemptRegister: this.attemptRegister,
    attemptLogout: this.attemptLogout,
  }

  componentDidMount = () => {
    this.checkForExistingState();
    this.checkForCallback();
  }

  componentWillUnmount() {
    if ( this.state.refreshTimer )
      clearInterval( this.state.refreshTimer );
  }

  asyncSetState = state => {
    return new Promise( resolve => this.setState( state, resolve ));
  }

  checkForExistingState = async () => {
    const session = localStorage.getItem( 'kcAuth' );

    try {
      const { state, nonce, accessToken, refreshToken, accessTokenExpiresOn, refreshTokenExpiresOn } = JSON.parse( session );
      const accessTokenHasExpired = this.hasTokenExpired( accessTokenExpiresOn );
      const refreshTokenHasExpired = this.hasTokenExpired( refreshTokenExpiresOn );

      if ( !refreshTokenHasExpired ) {
        await this.asyncSetState({
          sessionState: state,
          sessionNonce: nonce,
          accessToken: accessTokenHasExpired ? null : accessToken,
          refreshToken,
          isAuthenticated: true,
        });

        this.startTokenRefresh();
      }

      resolve();
    }
    catch ( e ) {}
  }

  checkForCallback() {
    const sessionState = localStorage.getItem( 'kcSessionState' );
    const { state, code, ...restQuery } = queryString.parse( location.search );
    const numberOfRestQueries = restQuery ? Object.keys( restQuery ).length : 0;

    if ( !sessionState ) return;
    if ( !state ) return;
    if ( !code ) return;

    /* Remove `state` and `code` from location.search. */
    if ( numberOfRestQueries.length > 0 )
      history.replaceState({}, null, `${location.pathname}?${queryString.stringify( restQuery )}` );
    else
      history.replaceState({}, null, location.pathname );

    /* Ensure the sessions are aligned. */
    if ( sessionState === state )
      this.handleAuthSuccess( code );
  }

  getValidRedirectUri() {
     if (
      location.pathname === '/login' ||
      location.pathname === '/register' ||
      location.pathname === '/logout'
    ) {
      return `${location.protocol}//${location.host}${location.search}`
    }

    return location.href;
  }

  createRealmUrl() {
    const { baseUrl, realm } = this.props;
    const encodedRealm = encodeURIComponent( realm );

    return `${baseUrl}/auth/realms/${encodedRealm}`;
  }

  createActionUrl = ( action, query = {}) => {
    const realmUrl = this.createRealmUrl();
    const redirectUri = this.getValidRedirectUri();
    const sessionState = uuid();
    const sessionNonce = uuid();

    const {
      response_type = 'code',
      redirect_uri = redirectUri,
      client_id = this.props.clientId,
      response_mode = 'query',
    } = query;

    const stringifiedQuery = queryString.stringify({
      response_type,
      response_mode,
      redirect_uri,
      client_id,
      state: sessionState,
      nonce: sessionNonce,
    });

    localStorage.setItem( 'kcSessionState', sessionState );
    localStorage.setItem( 'kcSessionNonce', sessionNonce );

    return `${realmUrl}/protocol/openid-connect/${action}?${stringifiedQuery}`;
  }

  createLoginUrl = options => {
    const url = this.createActionUrl( 'auth', options );

    return new Url( url );
  }

  createRegisterUrl = options => {
    const url = this.createActionUrl( 'registrations', options );

    return new Url( url );
  }

  createLogoutUrl = options => {
    const realmUrl = this.createRealmUrl();
    const redirectUri = this.getValidRedirectUri();

    const query = queryString.stringify({
      redirect_uri: redirectUri,
      ...options,
    });

    const url = `${realmUrl}/protocol/openid-connect/logout?${query}`;

    return new Url( url );
  }

  handleAuthSuccess = async code => {
    await this.asyncSetState({
      isAuthenticating: false,
      isRegistering: false,
      isAuthenticated: true,
    });

    this.startTokenRefresh( code );

    if ( this.state.promise ) {
      this.state.promise.resolve();

      this.setState({ promise: null });
    }
  }

  startTokenRefresh( code ) {
    this.handleTokenRefresh( code );

    this.setState({
      refreshTimer: setInterval( this.handleTokenRefresh, 5000 ), // 5 seconds
    });
  }

  handleFinishBrowserSession = action => ({ type }) => {
    const { promise } = this.state;

    if ( type === 'cancel' ) {
      if ( promise )
        promise.reject( `Could not ${action}! User dismissed window - try again.` );

      this.setState({
        error: `Could not ${action}! User dismissed window - try again.`,
      });
    }
  }

  handleTokenRefresh = async code => {
    const realmUrl = this.createRealmUrl();
    const url = `${realmUrl}/protocol/openid-connect/token`;
    const { authCode, refreshToken } = this.state;
    const { clientId } = this.props;
    const redirectUrl = `${location.protocol}//${location.host}`;

    const grantType = code
      ? 'authorization_code'
      : 'refresh_token';

    const grant = code
      ? { code }
      : { refresh_token: refreshToken };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: queryString.stringify({
        ...grant,
        grant_type: grantType,
        redirect_uri: redirectUrl,
        client_id: clientId,
      }),
    };

    this.setState({ isFetchingToken: true });

    try {
      const response = await fetch( url, options );
      const responseJson = await response.json();

      const { session_state } = responseJson;
      const sessionState = localStorage.getItem( 'kcSessionState' );

      /* TODO fix check */
      // if ( session_state === sessionState )
        this.handleTokenRefreshSuccess( responseJson );
    }
    catch ( error ) {
      this.setState({ isFetchingToken: false });

      this.handleError( error );
    }
  }

  handleTokenRefreshSuccess = async ({ access_token, refresh_token, id_token, expires_in, refresh_expires_in }) => {
    const currentTime = new Date().getTime();
    const accessExpiresInSeconds = expires_in * 1000; // Convert from seconds to ms
    const refreshExpiresInSeconds = refresh_expires_in * 1000; // Convert from seconds to ms

    await this.asyncSetState({
      refreshToken: refresh_token,
      refreshTokenExpiresOn: currentTime + refreshExpiresInSeconds,
      accessToken: access_token,
      accessTokenExpiresOn: currentTime + accessExpiresInSeconds,
      idToken: id_token,
      isFetchingToken: false,
    });

    localStorage.setItem( 'kcAuth', JSON.stringify({
      refreshToken: this.state.refreshToken,
      refreshTokenExpiresOn: this.state.refreshTokenExpiresOn,
      accessToken: this.state.accessToken,
      accessTokenExpiresOn: this.state.accessTokenExpiresOn,
      timestamp: new Date().getTime(),
    }));
  }

  handleError = error => {
    console.error( 'error', error );

    this.setState({ error });

    if ( this.state.promise ) {
      this.state.promise.reject( error );

      this.setState({ promise: null });
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

  hasTokenExpired( expiresOn ) {
    const currentTime = new Date().getTime();

    return currentTime > expiresOn;
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

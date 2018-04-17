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

    this.setState({ [`${action}State`]: uniqueIdentifier });

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
    
    this.setState({
      isAuthenticating: true,
      error: null,
    });

    Linking.addEventListener( 'url', this.handleUrlChange );

    WebBrowser
      .openAuthSessionAsync( loginUrl )
      .then( this.handleFinishBrowserSession( 'login' ));

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

    Linking.addEventListener( 'url', this.handleUrlChange );

    WebBrowser
      .openAuthSessionAsync( registerUrl )
      .then( this.handleFinishBrowserSession( 'register' ));

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
        authState: '',
        registrationsState: '',
        tokenState: '',
      }, resolve );
    });
  }

  state = {
    isAuthenticated: false,
    isAuthenticating: false,
    isRegistering: false,
    accessToken: null,
    refreshToken: null,    
    authState: '',
    registrationsState: '',
    tokenState: '',
    error: null,
    attemptLogin: this.attemptLogin,
    attemptRegister: this.attemptRegister,
    attemptLogout: this.attemptLogout,
  }

  componentWillUnmount() {
    Linking.removeEventListener( 'url', this.handleUrlChange );
  }

  asyncSetState = state => {
    return new Promise( resolve => this.setState( state, resolve ));
  }

  startTokenRefresh() {
    this.handleTokenRefresh();

    this.setState({
      refreshTimer: setInterval( this.handleTokenRefresh, 30000 ), // 30 seconds
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

  handleTokenRefresh = async () => {
    const realmUrl = this.createRealmUrl();
    const url = `${realmUrl}/protocol/openid-connect/token`;
    const uniqueIdentifier = uuid();
    const { refreshToken, sessionState } = this.state;
    const { clientId } = this.props;

    await this.asyncSetState({ tokenState: uniqueIdentifier });

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

    try {
      const response = await fetch( url, options );
      const responseJson = await response.json();
  
      this.handleTokenRefreshSuccess( responseJson );
    }
    catch ( error ) {
      this.handleError( error );
    }
  }

  handleTokenRefreshSuccess = ({ access_token, refresh_token, id_token }) => {
    this.setState({
      refreshToken: refresh_token,
      accessToken: access_token,
      idToken: id_token,
    });
  }

  handleError = error => {
    console.error( 'error', { error });

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
    const { authState } = this.state;
    const { query } = queryString.parseUrl( url );

    if (
      query &&
      query.state &&
      query.state === authState &&
      query.code
    ) {
      this.handleAuthSuccess( query.code );
    }
    else {
      this.handleError( 'Unable to decode keycloak URL after returning from auth screen.', { query, authState });
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

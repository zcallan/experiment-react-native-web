import { Linking } from 'react-native';
import { WebBrowser } from 'expo';

class Url {
  constructor( url ) {
    this.url = url;
  }

  addEventListener( event, callback ) {
    Linking.addEventListener( event, callback );
  }

  removeEventListener( event, callback ) {
    Linking.removeEventListener( event, callback );
  }

  open() {
    return WebBrowser.openBrowserAsync( this.url );
  }

  close() {
    return WebBrowser.dismissBrowser();
  }

  append( string ) {
    this.url += string;
  }
}

export default Url;

const decodeToken = token => {
  let decoded = token
    .split( '.' )[1]
    .replace( '/-/g', '+' )
    .replace( '/_/g', '/' );

  switch ( decoded.length % 4 ) {
    case 0: break;
    case 2: decoded += '=='; break;
    case 3: decoded += '='; break;
    default: throw 'Invalid decoded';
  }

  decoded = `${decoded}===`
    .slice( 0, decoded.length + ( decoded.length % 4 ))
    .replace( /-/g, '+' )
    .replace( /_/g, '/' );

  decoded = decodeURIComponent( escape( atob( decoded )));
  decoded = JSON.parse( decoded );

  return decoded;
}

export default decodeToken;

class Url {
  constructor( url ) {
    this.url = url;
  }

  /* Mock functions */
  addEventListener() {}
  removeEventListener() {}
  close() {}

  open( options = {}) {
    const {
      replace = false,
    } = options;

    if ( replace )
      window.location.replace( this.url );
    else
      window.location.href = this.url;
  }

  append( string ) {
    this.url += string;
  }
}

export default Url;

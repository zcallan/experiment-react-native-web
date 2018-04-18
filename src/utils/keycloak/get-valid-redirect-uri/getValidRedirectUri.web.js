const getValidRedirectUri = ( options = {}) => {
  const {
    excludeSearch = false,
  } = options;

  if (
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/logout'
  ) {
    const url = `${location.protocol}//${location.host}`;

    if ( excludeSearch )
      return url;

    return `${url}${location.search}`;
  }

  if ( excludeSearch )
    return location.href.split( '?' )[0];

  return location.href;
};

export default getValidRedirectUri;

import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { string, bool, oneOf, func } from 'prop-types';
import styles from './Link.web.css';


const Link = ({
  children = 'Link',
  href,
  disabled,
  onClick,
  ...restProps
}) => {
  const route = href === 'home'
    ? '/'
    : `/${href}`;

  return (
    <ReactRouterLink
      to={route}
      className={styles.wrapper}
    >
      {children}
    </ReactRouterLink>
  );
};

Link.propTypes = {
  children: string,
  href: string,
  disabled: bool,
  onClick: func,
};

export default Link;

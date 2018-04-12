import * as Pages from '../../views/pages';

export default [
  {
    path: '/',
    component: Pages.Home,
    exact: true,
  },
  {
    path: '/settings',
    component: Pages.Settings,
  },
];

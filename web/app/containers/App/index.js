/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { css } from 'aphrodite/no-important';
import styles from './style';

import HomePage from 'containers/HomePage/Loadable';
import RegistrationPage from 'containers/RegistrationPage/Loadable';
import LoginPage from 'containers/LoginPage/Loadable';
import ProfilePage from 'containers/ProfilePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import PageHeader from '../PageHeader';

export default function App() {
  return (
    <div className={css(styles.app)}>
      <PageHeader />
      <div className={css(styles.pageContainer)}>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/registration" component={RegistrationPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/profile" component={ProfilePage} />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
    </div>
  );
}

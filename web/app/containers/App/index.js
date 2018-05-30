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
import NotFoundPage from 'containers/NotFoundPage/Loadable';

export default function App() {
  return (
    <div className={css(styles.app)}>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/registration" component={RegistrationPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  );
}

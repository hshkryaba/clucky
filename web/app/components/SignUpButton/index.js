import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import messages from './messages';
import { css } from 'aphrodite/no-important';
import styles from './style';

class SignUpButton extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Link className={css(styles.signup)} to="/registration">
        <FormattedMessage {...messages.signup} />
      </Link>
    );
  }
}
export default SignUpButton;

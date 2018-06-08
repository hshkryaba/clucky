import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import messages from './messages';
import { css } from 'aphrodite/no-important';
import styles from './style';

class SignUpButton extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    function notAuthBlock () {
      return <div className={css(styles.authorizeBlock)}>
               <Link className={css(styles.signup)} to="/registration">
                 <FormattedMessage {...messages.signup} />
               </Link>
               <span className={css(styles.or)}>or</span>
               <Link className={css(styles.signup)} to="/login">
                 <FormattedMessage {...messages.login} />
               </Link>
             </div>
    };
    function authBlock () {
      return <div>
               <Link className={css(styles.signup)} to="/">
                 <FormattedMessage {...messages.logout} />
               </Link>
             </div>
    }
    return (
      this.props.auth ? authBlock() : notAuthBlock()
    );
  }
}
export default SignUpButton;

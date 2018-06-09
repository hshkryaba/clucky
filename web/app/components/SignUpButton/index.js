import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import messages from './messages';
import { css } from 'aphrodite/no-important';
import styles from './style';

class SignUpButton extends React.Component { // eslint-disable-line react/prefer-stateless-function
  notAuthBlock = () => {
    return (
      <div className={css(styles.authorizeBlock)}>
        <Link className={css(styles.signup)} to="/registration">
          <FormattedMessage {...messages.signup} />
        </Link>
        <span className={css(styles.or)}>or</span>
        <Link className={css(styles.signup)} to="/login">
          <FormattedMessage {...messages.login} />
        </Link>
      </div>
    );
  };
  authBlock = () => {
    return (
      <div className={css(styles.authorizeBlock)}>
        <Link className={css(styles.signup)} to="/profile">
          <FormattedMessage {...messages.profile} />
        </Link>
        <span className={css(styles.or)}>&nbsp;</span>
        <button className={css(styles.signup)} to="/" onClick={() => { this.props.logout(); }}>
          <FormattedMessage {...messages.logout} />
        </button>
      </div>
    );
  }
  render() {
    return (
      this.props.auth ? this.authBlock() : this.notAuthBlock()
    );
  }
}
export default connect(
  (state) => ({
  }),
  (dispatch) => ({
    logout: () => { dispatch({ type: 'LOGOUT' }); },
  })
)(SignUpButton);

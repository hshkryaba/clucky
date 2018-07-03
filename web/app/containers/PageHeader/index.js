import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import axios from 'axios';
import messages from './messages';
import { css } from 'aphrodite/no-important';
import styles from './style';
import SignUpButton from 'components/SignUpButton';
import { connect } from 'react-redux';

class PageHeader extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {};
    if (localStorage.getItem('auth') !== null) {
      props.initialAuth();
    }
  }
  render() {
    return (
      <div className={css(styles.header)}>
        <div className={css(styles.logoBlock)}>
          <Link className={css(styles.logo)} to="/" />
          <div className={css(styles.logoHeader)}>
            <FormattedMessage {...messages.header} />
          </div>
        </div>
        <SignUpButton auth={this.props.auth} />
      </div>
    );
  }
}
export default connect(
  (state) => ({
    auth: state._root.entries.filter((entry) => entry[0] === 'signUp')[0][1].auth,
    jwt: state._root.entries.filter((entry) => entry[0] === 'signUp')[0][1].jwt,
  }),
  (dispatch) => ({
    initialAuth: () => { dispatch({ type: 'INITIAL_AUTH' }); },
  })
)(PageHeader);

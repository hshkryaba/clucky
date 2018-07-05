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
    const item = localStorage.getItem('refresh');
    if (item !== null) {
      this.refreshToken(item);
    }
  }
  refreshToken = (token) => {
    axios.post('http://localhost:80/api/auth/refresh', {}, { headers: {
      'Authorization': 'Bearer ' + token,
    } })
    .then((response) => {
      let res = JSON.parse(response.request.response.replace(/\\"/g, '"'));
      let accessToken = res.result[0].accessToken;
      let refreshToken = res.result[0].refreshToken;
      this.props.auth(accessToken, refreshToken);
    })
    .catch((error) => {
      console.log(error);
      this.props.logout();
    });
  };
  render() {
    return (
      <div className={css(styles.header)}>
        <div className={css(styles.logoBlock)}>
          <Link className={css(styles.logo)} to="/" />
          <div className={css(styles.logoHeader)}>
            <FormattedMessage {...messages.header} />
          </div>
        </div>
        <SignUpButton auth={this.props.auth} history={this.props.history} />
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
    logout: () => { dispatch({ type: 'LOGOUT' }); },
    auth: (accessToken, refreshToken) => { dispatch({ type: 'SUCCESS_AUTH', jwt: accessToken, refresh: refreshToken }); },
  })
)(PageHeader);

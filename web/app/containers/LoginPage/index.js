import React from 'react';
import { connect } from 'react-redux';
import crypto from 'crypto';
import LoginForm from 'components/LoginForm';
import axios from 'axios';
const config = require('crypto_conf');

class LoginPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      jwt: '',
    };
  }
  pairsToObject = (pairs) => {
    const ret = {};
    pairs.forEach((p) => {
      if (p[0] === 'password') {
        ret.pwd_hash = crypto.createHmac('sha256', config.crypto.key)
          .update(config.crypto.salt + p[1])
          .digest('hex');
      } else {
        ret[p[0]] = p[1];
      }
    });
    return ret;
  };
  handleSubmit = (values) => {
    const loginPass = this.pairsToObject(values._root.entries);
    const { auth } = this.props;
    console.log(loginPass);
    axios.post('http://localhost:80/api/auth/login', loginPass)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
  }
  render() {
    return (
      <LoginForm onSubmit={this.handleSubmit} />
    );
  }
}
export default connect(
  (state) => ({}),
  (dispatch) => ({
    auth: (jwtoken) => { dispatch({ type: 'SUCCESS_AUTH', jwt: jwtoken }); },
  })
)(LoginPage);

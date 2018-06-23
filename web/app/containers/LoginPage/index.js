import React from 'react';
import { connect } from 'react-redux';
import md5 from 'md5';
import LoginForm from 'components/LoginForm';
import axios from 'axios';

class LoginPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  pairsToObject = (pairs) => {
    const ret = {};
    pairs.forEach((p) => { ret[p[0]] = p[1]; });
    return ret;
  };
  handleSubmit = (values) => {
    const loginPass = this.pairsToObject(values._root.entries);
    const { auth } = this.props;
    axios.get('http://localhost:4000/users')
    .then((response) => {
      const user = response.data.find((u) => u.username === loginPass.username && u.password_hash === md5(loginPass.password));
      if (user != null) {
        this.props.auth(user);
        this.props.history.push('/');
      } else {
        console.log('user not exists');
      }
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
    auth: (user) => { dispatch({ type: 'SUCCESS_AUTH', authUser: user }); },
  })
)(LoginPage);

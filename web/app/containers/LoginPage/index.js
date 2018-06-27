import React from 'react';
import { connect } from 'react-redux';
import LoginForm from 'components/LoginForm';
import axios from 'axios';

class LoginPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      jwt: '',
      responsiveMsg: '',
    };
  }
  pairsToObject = (pairs) => {
    const ret = {};
    pairs.forEach((p) => {
      ret[p[0]] = p[1];
    });
    return ret;
  };
  handleSubmit = (values) => {
    const loginPass = this.pairsToObject(values._root.entries);
    const { auth, history } = this.props;
    axios.post('http://localhost:80/api/auth/login', loginPass)
    .then((response) => {
      let res = JSON.parse(response.request.response.replace(/\\"/g, '"'));
      this.setState({
        jwt: res.result[0].accessToken,
      });
      auth(this.state.jwt);
      history.push('/');
    })
    .catch((error) => {
      this.setState({
        responsiveMsg: 'Invalid login or password',
      });
    });
  }
  render() {
    return (
      <LoginForm onSubmit={this.handleSubmit} message={this.state.responsiveMsg} />
    );
  }
}
export default connect(
  (state) => ({}),
  (dispatch) => ({
    auth: (jwtoken) => { dispatch({ type: 'SUCCESS_AUTH', jwt: jwtoken }); },
  })
)(LoginPage);

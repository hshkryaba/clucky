import React from 'react';
import { connect } from 'react-redux';
import LoginForm from 'components/LoginForm';
import axios from 'axios';

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
      ret[p[0]] = p[1];
    });
    return ret;
  };
  handleSubmit = (values) => {
    const loginPass = this.pairsToObject(values._root.entries);
    const { auth } = this.props;
    console.log(loginPass);
    axios.post('http://localhost:80/api/auth/login', loginPass)
    .then((response) => {
      let res = JSON.parse(response.request.response.replace(/\\"/g, '"'));
      this.setState({
        jwt: res.result[0].accessToken,
      });
      auth(this.state.jwt);
      console.log(res.result[0].accessToken);
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

import React from 'react';
import { FormattedMessage } from 'react-intl';
import md5 from 'md5';
import messages from './messages';
import SignUpForm from 'components/SignUpForm';
import axios from 'axios';
import { connect } from 'react-redux';
const config = require('config');

class RegistrationPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      responsiveMsg: '',
    }
  }
  pairsToObject = (pairs) => {
    const ret = {};
    pairs.forEach((p) => {
      ret[p[0]] = p[1];
    });
    return ret;
  };
  handleSubmit = (values) => {
    let user = '';
    if (typeof values._root.entries !== 'undefined') {
      user = this.pairsToObject(values._root.entries);
    } else return;
    axios.post(config.host + '/api/auth/register', user)
    .then((response) => {
      this.setState({
        responsiveMsg: 'User was created',
      });
      setTimeout(() => {
        this.props.history.push('/login');
      }, 2000);
    })
    .catch((error) => {
      const err = error.response.request.response.replace(/\\"/g, '"');
      this.setState({
        responsiveMsg: JSON.parse(err).error.message,
      });
    });
  }
  render() {
    return (
      <SignUpForm onSubmit={this.handleSubmit} message={this.state.responsiveMsg} />
    );
  }
}

export default connect(
  (state) => ({}),
  (dispatch) => ({})
)(RegistrationPage);

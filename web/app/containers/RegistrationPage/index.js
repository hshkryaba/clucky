import React from 'react';
import { FormattedMessage } from 'react-intl';
import md5 from 'md5';
import messages from './messages';
import SignUpForm from 'components/SignUpForm';
import axios from 'axios';

export default class RegistrationPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  pairsToObject = (pairs) => {
    const ret = {};
    pairs.forEach((p) => {
      if (p[0] === 'password') {
        ret.password_hash = md5(p[1]);
      } else {
        ret[p[0]] = p[1];
      }
    });
    return ret;
  };
  handleSubmit = (values) => {
    const currentdate = new Date();
    const datetime = currentdate.getFullYear() + '-'
                + ('0' + (currentdate.getMonth() + 1)).slice(-2) + '-'
                + ('0' + currentdate.getDate()).slice(-2) + ' '
                + currentdate.getHours() + ':'
                + currentdate.getMinutes() + ':'
                + currentdate.getSeconds();
    let user = '';
    if (typeof values._root.entries !== 'undefined') {
      user = this.pairsToObject(values._root.entries);
    } else return;
    user.access_token = null;
    user.created_at = datetime;
    user.score = null;
    user.date = datetime;
    axios.post('http://localhost:4000/users', user)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
  }
  render() {
    return (
      <SignUpForm onSubmit={this.handleSubmit} />
    );
  }
}

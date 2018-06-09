import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import SignUpForm from 'components/SignUpForm';
import axios from 'axios';

export default class RegistrationPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  pairs_to_object = pairs => {
    var ret = {};
    pairs.forEach(function (p) { ret[p[0]] = p[1]; });
    return ret;
}
  handleSubmit = values => {
    let currentdate = new Date(); 
    let datetime = currentdate.getFullYear() + "-"
                + ('0' + (currentdate.getMonth()+1)).slice(-2)  + "-" 
                + ('0' + currentdate.getDate()).slice(-2) + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
    let user = this.pairs_to_object(values._root.entries);
    user.access_token = null,
    user.password_hash = null,
    user.created_at = datetime,
    user.score = null,
    user.date = datetime,
    axios.post('http://localhost:4000/users', user)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  render() {
    return (
      <SignUpForm onSubmit={this.handleSubmit}/>
    );
  }
}

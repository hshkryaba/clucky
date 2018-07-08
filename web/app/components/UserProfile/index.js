import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import messages from './messages';
import { css } from 'aphrodite/no-important';
import styles from './style';
import logo from 'images/logo.png';
const config = require('config');

class UserProfile extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      jwt: props.jwt,
      name: '',
      answers: 0,
      questions: 0,
    };
    this.getUserName(this.props.parsedJwt.id).then((name) => { this.setState({ name: name }); });
    this.getUserAnswers(this.props.parsedJwt.id).then((answers) => { this.setState({ answers: answers }); });
    this.getUserQuestions(this.props.parsedJwt.id).then((questions) => { this.setState({ questions: questions }); });
  }
  
  getUserName = (userId) => new Promise((resolve, reject) => {
    axios.get(`${config.host}/api/users/${userId}`)
    .then((response) => {
      const user = response.data.result[0].login;
      user != null || undefined ? resolve(user) : reject('');
    })
    .catch((error) => {
      console.log(error);
    });
  });
  getUserAnswers = (userId) => new Promise((resolve, reject) => {
    axios.get(`${config.host}/api/users/${userId}/answers`)
    .then((response) => {
      const answers = response.data.result.length;
      answers != null ? resolve(answers) : reject(0);
    })
    .catch((error) => {
      console.log(error);
    });
  });
  getUserQuestions = (userId) => new Promise((resolve, reject) => {
    axios.get(`${config.host}/api/users/${userId}/questions`)
    .then((response) => {
      const questions = response.data.result.length;
      questions > 0 ? resolve(questions) : reject(0);
    })
    .catch((error) => {
      console.log(error);
    });
  });
  render() {
    return (
      <div className={css(styles.userProfile)}>
        <div className={css(styles.userAvatar)}>
          <img src={logo} alt="" className={css(styles.userAvatarImg)} />
          <div className={css(styles.userAvatarShadow)} />
        </div>
        <div className={css(styles.userName)}>{this.state.name}</div>
        <div className={css(styles.infoRow)}>
          <div className={css(styles.infoRowTitle)}>Answers:</div>
          <div className={css(styles.infoRowValue)}>{this.state.answers}</div>
        </div>
        <div className={css(styles.infoRow)}>
          <div className={css(styles.infoRowTitle)}>Questions:</div>
          <div className={css(styles.infoRowValue)}>{this.state.questions}</div>
        </div>
      </div>
    );
  }
}
export default connect(
  (state) => ({
    parsedJwt: JSON.parse(state._root.entries.filter((entry) => entry[0] === 'signUp')[0][1].parsedJwt),
    jwt: state._root.entries.filter((entry) => entry[0] === 'signUp')[0][1].jwt,
  }),
  (dispatch) => ({
  })
)(UserProfile);

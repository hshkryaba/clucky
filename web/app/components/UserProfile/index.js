import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import messages from './messages';
import { css } from 'aphrodite/no-important';
import styles from './style';
import logo from 'images/logo.png';

class UserProfile extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      name: props.user.user,
      jwt: props.user.jwt,
    };
    this.getUserAnswers(this.props.jwt.id).then((answers) => { this.setState({ answers: answers }); });
    this.getUserQuestions(this.props.jwt.id).then((questions) => { this.setState({ questions: questions }); });
  }
  getUserAnswers = (userId) => new Promise((resolve, reject) => {
    axios.get(`http://localhost:80/api/users/${userId}/answers`, { headers: {
      'Authorization': 'Bearer ' + this.state.jwt,
      'content-type': 'application/json; charset=utf-8',
    } })
    .then((response) => {
      const userPoints = response.data.find((p) => p.userId === userId);
      userPoints != null ? resolve(userPoints.score) : reject(0);
    })
    .catch((error) => {
      console.log(error);
    });
  });
  getUserQuestions = (userId) => new Promise((resolve, reject) => {
    axios.get(`http://localhost:80/api/users/${userId}/questions`, { headers: {
      'Authorization': 'Bearer ' + this.state.jwt,
      'content-type': 'application/json; charset=utf-8',
    } })
    .then((response) => {
      const userVotes = response.data.filter((v) => v.userId === userId).length;
      userVotes > 0 ? resolve(userVotes) : reject(0);
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
    user: JSON.parse(state._root.entries.filter((entry) => entry[0] === 'signUp')[0][1].user),
    jwt: JSON.parse(state._root.entries.filter((entry) => entry[0] === 'signUp')[0][1].jwt),
  }),
  (dispatch) => ({
  })
)(UserProfile);

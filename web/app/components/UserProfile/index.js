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
      name: this.props.user.name,
    };
    this.getUserPoints(this.props.user.id).then((points) => { this.setState({ points: points }); });
    this.getUserVotes(this.props.user.id).then((votes) => { this.setState({ votes: votes }); });
  }
  getUserPoints = (userId) => new Promise((resolve, reject) => {
    axios.get('http://localhost:4000/points')
    .then((response) => {
      const userPoints = response.data.find((p) => p.userId === userId);
      userPoints != null ? resolve(userPoints.score) : reject(0);
    })
    .catch((error) => {
      console.log(error);
    });
  });
  getUserVotes = (userId) => new Promise((resolve, reject) => {
    axios.get('http://localhost:4000/votes')
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
          <div className={css(styles.infoRowTitle)}>Points:</div>
          <div className={css(styles.infoRowValue)}>{this.state.points}</div>
        </div>
        <div className={css(styles.infoRow)}>
          <div className={css(styles.infoRowTitle)}>Votes:</div>
          <div className={css(styles.infoRowValue)}>{this.state.votes}</div>
        </div>
      </div>
    );
  }
}
export default connect(
  (state) => ({
    user: state._root.entries.filter((entry) => entry[0] === 'signUp')[0][1].user,
  }),
  (dispatch) => ({
  })
)(UserProfile);

import React from 'react';
import UserProfile from 'components/UserProfile';
import { connect } from 'react-redux';
import { css } from 'aphrodite/no-important';
import styles from './style';

class ProfilePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <UserProfile />
    );
  }
}
export default connect(
  (state) => ({
  }),
  (dispatch) => ({})
)(ProfilePage);

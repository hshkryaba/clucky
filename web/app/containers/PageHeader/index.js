import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { css } from 'aphrodite/no-important';
import styles from './style';
import SignUpButton from 'components/SignUpButton';
import { connect } from 'react-redux';

class PageHeader extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={css(styles.header)}>
        <Link className={css(styles.logo)} to="/"/>
        <SignUpButton auth={this.props.auth}/>
      </div>
    );
  }
}
export default connect(
  state => ({
    auth: state._root.entries.filter(entry => entry[0] == 'signUp')[0][1].auth
  }),
  dispatch => ({})
)(PageHeader);

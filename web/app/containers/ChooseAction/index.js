import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import ActionItem from 'components/ActionItem';
import { connect } from 'react-redux';
import axios from 'axios';
import messages from './messages';
import { css } from 'aphrodite/no-important';
import styles from './style';

class ChooseAction extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={css(styles.actionContainer)}>
        <ActionItem type="play" changeScreenState={this.props.changeScreenState} />
        <ActionItem type="ask" changeScreenState={this.props.changeScreenState} />
      </div>
    );
  }
}
export default connect(
  (state) => ({}),
  (dispatch) => ({})
)(ChooseAction);

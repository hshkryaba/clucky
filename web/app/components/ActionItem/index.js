import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import messages from './messages';
import { css } from 'aphrodite/no-important';
import styles from './style';

class ActionItem extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return(
      <div className={css(styles.actionItem)}>
        <FormattedMessage {...messages[this.props.type]} />
      </div>
    );
  }
}
export default connect(
  (state) => ({}),
  (dispatch) => ({})
)(ActionItem);

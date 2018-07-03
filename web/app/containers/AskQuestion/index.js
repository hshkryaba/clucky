import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import messages from './messages';
import { css } from 'aphrodite/no-important';
import styles from './style';

class AskQuestion extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>Ask</div>
    );
  }
}
export default connect(
  (state) => ({}),
  (dispatch) => ({})
)(AskQuestion);

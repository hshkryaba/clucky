import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import PlayForm from 'components/PlayForm';
import { connect } from 'react-redux';
import axios from 'axios';
import messages from './messages';
import { css } from 'aphrodite/no-important';
import styles from './style';
const config = require('config');

class PlayCluck extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      responsiveMsg: '',
    };
  }
  pairsToObject = (pairs) => {
    const ret = {};
    pairs.forEach((p) => {
      if(p[0] !== 'subject') {
        ret[p[0]] = p[1];
      }
    });
    return ret;
  };

  handleSubmit = (values) => {
    const formData = this.pairsToObject(values._root.entries);
    console.log(formData);
    axios.post(config.host + '/api/answers/', formData)
    .then((response) => {
      console.log(response.data);
      this.setState({
        responsiveMsg: messages.answerAdded.defaultMessage,
      });``
    })
    .catch((error) => {
      this.setState({
        responsiveMsg: messages.answerWasNotAdded.defaultMessages,
      });
    });
  }
  render() {
    return (
      <div className={css(styles.playForm)}>
        <PlayForm onSubmit={this.handleSubmit} message={this.state.responsiveMsg} />
      </div>
    );
  }
}
export default connect(
  (state) => ({}),
  (dispatch) => ({})
)(PlayCluck);

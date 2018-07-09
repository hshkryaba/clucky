import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import AskForm from 'components/AskForm';
import { connect } from 'react-redux';
import axios from 'axios';
import messages from './messages';
import { css } from 'aphrodite/no-important';
import styles from './style';
const config = require('config');

class AskQuestion extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      responsiveMsg: '',
    };
  }
  pairsToObject = (pairs) => {
    const ret = {};
    pairs.forEach((p) => {
      ret[p[0]] = p[1];
    });
    return ret;
  };

  handleSubmit = (values) => {
    const formData = this.pairsToObject(values._root.entries);
    const { changeScreenState } = this.props;
    axios.post(config.host + '/api/questions/', formData)
    .then((response) => {
      const questionId = response.data.result[0].id;
      this.setState({
        responsiveMsg: messages.questionAdded.defaultMessage,
      });
      axios.post(config.host + `/api/categories/${formData.subject}/questions/${questionId}/set`)
      .then((response) => {console.log(response.data)})
      .catch((error) => {console.log(error)});
      setTimeout(() => {
        changeScreenState();
      }, 2000);
    })
    .catch((error) => {
      this.setState({
        responsiveMsg: messages.questionWasNotAdded.defaultMessages,
      });
    });
  }

  render() {
    return (
      <div className={css(styles.askForm)}>
        <AskForm onSubmit={this.handleSubmit} message={this.state.responsiveMsg} />
      </div>
    );
  }
}
export default connect(
  (state) => ({}),
  (dispatch) => ({})
)(AskQuestion);

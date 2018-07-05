import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import AskItem from 'components/AskItem';
import { connect } from 'react-redux';
import axios from 'axios';
import messages from './messages';
import { css } from 'aphrodite/no-important';
import styles from './style';

class AskQuestion extends React.Component { // eslint-disable-line react/prefer-stateless-function
  pairsToObject = (pairs) => {
    const ret = {};
    pairs.forEach((p) => {
      ret[p[0]] = p[1];
    });
    return ret;
  };

  handleSubmit = (values) => {
    const formData = this.pairsToObject(values._root.entries);
    const { auth, history } = this.props;
    axios.post('http://localhost:80/api/questions/', formData)
    .then((response) => {
      console.log(response.data);
      let res = JSON.parse(response.request.response.replace(/\\"/g, '"'));
      let jwt = res.result[0].accessToken;
      auth(jwt);
      history.push('/');
    })
    .catch((error) => {
      this.setState({
        responsiveMsg: 'Invalid login or password',
      });
    });
  }

  render() {
    return (
      <div className={css(styles.askForm)}>
        <AskItem onSubmit={this.handleSubmit} />
      </div>
    );
  }
}
export default connect(
  (state) => ({}),
  (dispatch) => ({})
)(AskQuestion);

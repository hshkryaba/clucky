import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import ChooseAction from 'containers/ChooseAction';
import AskQuestion from 'containers/AskQuestion';
import PlayCluck from 'containers/PlayCluck';
import { connect } from 'react-redux';
import messages from './messages';
import { css } from 'aphrodite/no-important';
import styles from './style';

class CluckApp extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      screenState: 'start',
    };
  }
  changeScreenState = (state) => {
    this.setState({ screenState: state });
  };
  renderComponent = () => {
    switch (this.state.screenState) {
      case 'start':
        return <ChooseAction changeScreenState={this.changeScreenState} />;
      case 'ask':
        return <AskQuestion changeScreenState={this.changeScreenState} />;
      case 'play':
        return <PlayCluck changeScreenState={this.changeScreenState} />;
      default:
        return <ChooseAction changeScreenState={this.changeScreenState} />;
    }
  };
  render() {
    return (
      <div className={css(styles.cluckApp)}>
        {this.renderComponent()}
      </div>
    );
  }
}
export default connect(
  (state) => ({}),
  (dispatch) => ({})
)(CluckApp);

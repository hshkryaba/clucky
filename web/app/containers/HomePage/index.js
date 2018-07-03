import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import CluckApp from 'components/CluckApp';

export default class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <CluckApp />
    );
  }
}

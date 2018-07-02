import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import ChooseAction from 'components/ChooseAction';

export default class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <ChooseAction />
    );
  }
}

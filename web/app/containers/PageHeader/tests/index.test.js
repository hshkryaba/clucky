import React from 'react';
import { FormattedMessage } from 'react-intl';
import { shallow } from 'enzyme';

import HomePage from '../index';
import messages from '../messages';

describe('<PageHeader />', () => {
  it('should render the page message', () => {
    const renderedComponent = shallow(
      <PageHeader />
    );
    expect(renderedComponent.contains(
      <FormattedMessage {...messages.header} />
    )).toEqual(true);
  });
});

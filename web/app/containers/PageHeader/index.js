import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { css } from 'aphrodite/no-important';
import styles from './style';
import SignUpButton from 'components/SignUpButton';

class PageHeader extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={css(styles.header)}>
        <Link className={css(styles.logo)} to="/"/>
        <SignUpButton/>
      </div>
    );
  }
}
export default PageHeader;

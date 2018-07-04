import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field, reduxForm } from 'redux-form/immutable';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import messages from './messages';
import { css } from 'aphrodite/no-important';
import styles from './style';

class AskItem extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  handleClick = () => {
  };
  handleTextarea() {
  }
  renderCategories = () => {
    let categories = [];
    for (let i = 0; i < 3; i++) {
      categories.push(
        <option value={i} key={i}>{i}</option>
      )
    }
    return categories;
  };
  render() {
    const { handleSubmit, reset, pristine, submitting } = this.props;
    return (
      <div className={css(styles.formWrapper)}>
        <form onSubmit={handleSubmit} className={css(styles.form)}>
          <Field name="category" component="select" className={css(styles.formItem)}>
            {this.renderCategories()}
          </Field>
          <Field name="question" component="textarea" className={css(styles.formItem)} onChange={this.handleTextarea} />
          <button type="submit" disabled={pristine || submitting} className={css(styles.formButton)}>Submit</button>
        </form>
      <div className={css(styles.statusMsg)}>{this.props.message}</div>
      </div>
    );
  }
}
AskItem = reduxForm({
  form: 'askQuestion',
})(AskItem)

export default AskItem;

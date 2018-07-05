import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field, reduxForm } from 'redux-form/immutable';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import messages from './messages';
import { css } from 'aphrodite/no-important';
import styles from './style';

class AskItem extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
    };
    this.getCategories().then((categories) => { this.setState({ categories }); });
  }
  getCategories = () => new Promise((resolve, reject) => {
    axios.get('http://localhost:80/api/categories')
    .then((response) => {
      const categories = response.data.result;
      categories != null || undefined ? resolve(categories) : reject([]);
    })
    .catch((error) => {
      console.log(error);
    });
  });
  handleClick = () => {
  };
  handleTextarea() {
  }
  renderCategories = () => this.state.categories.map(
    (category) =>
      <option value={category.id} key={category.id}>{category.name}</option>
    );
  render() {
    const { handleSubmit, pristine, submitting } = this.props;
    return (
      <div className={css(styles.formWrapper)}>
        <form onSubmit={handleSubmit} className={css(styles.form)}>
          <Field name="subject" component="select" className={css(styles.formItem, styles.formSelect)}>
            <option
              className={css(styles.selectOption)}
              value=""
              disabled
              hidden>{messages.category.defaultMessage}</option>
            {this.renderCategories()}
          </Field>
          <Field
            name="question"
            component="textarea"
            className={css(styles.formItem, styles.textArea)}
            onChange={this.handleTextarea} />
          <button
            type="submit"
            disabled={pristine || submitting}
            className={css(styles.formItem, styles.formSubmit)}>Submit</button>
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

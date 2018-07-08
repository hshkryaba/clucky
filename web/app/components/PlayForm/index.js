import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field, reduxForm } from 'redux-form/immutable';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import messages from './messages';
import { css } from 'aphrodite/no-important';
import styles from './style';
const config = require('config');

class PlayForm extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      selectedCategories: [],
      question: {
        id: '',
        text: '',
      },
    };
    this.getCategories().then((categories) => { this.setState({ categories }); });
  }
  getCategories = () => new Promise((resolve, reject) => {
    axios.get(config.host + '/api/categories')
    .then((response) => {
      const categories = response.data.result;
      categories != null || undefined ? resolve(categories) : reject([]);
    })
    .catch((error) => {
      console.log(error);
    });
  });
  getQuestionText = (categoryId) => new Promise((resolve, reject) => {
    //axios.get(config.host + '/api/categories/' + categoryId + '/questions')
    axios.get(config.host + '/api/questions/2')
    .then((response) => {
      const question = response.data.result[0];
      question != null || undefined ? resolve(question) : reject([]);
    })
    .catch((error) => {
      console.log(error);
    });
  });
  handleSelect = (event) => {
    this.setState({ selectedCategories: [event.target.value] });
    this.getQuestionText(
      event.target.value,
    ).then((data) => { this.setState({ question: {
        id: data.id,
        text: data.question,
      }
     });
     this.props.change('question_id', data.id);
   });
  };
  renderCategories = () => this.state.categories.map(
    (category) =>
      <option value={category.id} key={category.id}>{category.name}</option>
    );
  render() {
    const { handleSubmit, pristine, submitting } = this.props;
    return (
      <div className={css(styles.formWrapper)}>
        <form onSubmit={handleSubmit} className={css(styles.form)}>
          <Field
            name="subject"
            component="select"
            className={css(styles.formItem, styles.formSelect)}
            onChange={this.handleSelect}>
            <option
              className={css(styles.selectOption)}
              value=""
              disabled
              hidden>{messages.category.defaultMessage}</option>
            {this.renderCategories()}
          </Field>
          <Field name="question_id" component="input" hidden />
          <div className={css(styles.formItem)}>
            {this.state.question.text}
          </div>
          <Field
            name="answer"
            component="textarea"
            placeholder={messages.answer.defaultMessage}
            className={css(styles.formItem, styles.textArea)}
            onChange={this.handleTextarea} />
          <button
            type="submit"
            disabled={pristine || submitting}
            className={css(styles.formItem, styles.formSubmit)}>{messages.answer.defaultMessage}</button>
        </form>
      <div className={css(styles.statusMsg)}>{this.props.message}</div>
      </div>
    );
  }
}
PlayForm = reduxForm({
  form: 'playForm',
})(PlayForm)

export default PlayForm;

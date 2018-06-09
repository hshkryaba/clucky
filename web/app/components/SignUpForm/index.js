import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Field, reduxForm } from 'redux-form/immutable';
import messages from './messages';
import { css } from 'aphrodite/no-important';
import styles from './style';

class SignUpForm extends React.Component { // eslint-disable-line react/prefer-stateless-function
  renderField = ({ input, label, type }) => (
    <div className={css(styles.formRow)}>
      <label className={css(styles.formLabel)}>{label}</label>
      <input {...input} placeholder={label} type={type} className={css(styles.formField)} />
    </div>
  );
  render() {
    const { handleSubmit, reset } = this.props;
    return (
      <form onSubmit={handleSubmit} className={css(styles.form)}>
        <Field name="name" component={this.renderField} label="Name" type="text" />
        <Field name="surname" component={this.renderField} label="Surname" type="text" />
        <Field name="username" component={this.renderField} label="Login" type="text" />
        <Field name="password" component={this.renderField} label="Password" type="text" />
        <button type="button" onClick={reset} className={css(styles.formButton)}>Reset</button>
        <button type="submit" className={css(styles.formButton)}>Submit</button>
      </form>
    );
  }
}

SignUpForm = reduxForm({
  form: 'registration'
})(SignUpForm)

export default SignUpForm;

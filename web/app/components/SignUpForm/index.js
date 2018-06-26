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
    const { handleSubmit, reset, pristine, submitting } = this.props;
    return (
      <div className={css(styles.formWrapper)}>
        <form onSubmit={handleSubmit} className={css(styles.form)}>
          <Field name="login" component={this.renderField} label="Login" type="text" />
          <Field name="password" component={this.renderField} label="Password" type="password" />
          <Field name="email" component={this.renderField} label="Email" type="email" />
          <button type="button" disabled={pristine || submitting} onClick={reset} className={css(styles.formButton)}>Reset</button>
          <button type="submit" disabled={pristine || submitting} className={css(styles.formButton)}>Submit</button>
        </form>
      <div className={css(styles.statusMsg)}>{this.props.message}</div>
      </div>
    );
  }
}

SignUpForm = reduxForm({
  form: 'registration',
})(SignUpForm)

export default SignUpForm;

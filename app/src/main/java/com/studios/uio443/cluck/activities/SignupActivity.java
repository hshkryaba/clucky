package com.studios.uio443.cluck.activities;

import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.TextInputLayout;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.studios.uio443.cluck.R;
import com.studios.uio443.cluck.models.User;
import com.studios.uio443.cluck.services.DataService;

import butterknife.BindView;
import butterknife.ButterKnife;

public class SignupActivity extends AppCompatActivity {

    //используем butterknife
    //https://jakewharton.github.io/butterknife/
    //Обзор Butter Knife - https://startandroid.ru/ru/blog/470-butter-knife.html
    @BindView(R.id.signup_username_layout)
    TextInputLayout signupUsernameLayout;
    @BindView(R.id.signup_email_layout)
    TextInputLayout signupEmailLayout;
    @BindView(R.id.signup_password_layout)
    TextInputLayout signupPasswordLayout;
    @BindView(R.id.signup_reEnterPassword_layout)
    TextInputLayout signupReEnterPasswordLayout;
    @BindView(R.id.signup_username_input)
    EditText signupUsernameInput;
    @BindView(R.id.signup_email_input)
    EditText signupEmailInput;
    @BindView(R.id.signup_password_input)
    EditText signupPasswordInput;
    @BindView(R.id.signup_reEnterPassword_input)
    EditText signupReEnterPasswordInput;
    @BindView(R.id.btn_signup)
    Button btnSignup;
    @BindView(R.id.link_login)
    TextView linkLogin;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signup);
        ButterKnife.bind(this);

        btnSignup.setOnClickListener(v -> signup());

        linkLogin.setOnClickListener(v -> {
            Intent intent = new Intent(getApplicationContext(), LoginActivity.class);
            startActivity(intent);
            overridePendingTransition(R.anim.push_left_in, R.anim.push_left_out);
        });

    }

    public void signup() {
        Log.d("signup", "Signing Up");

        if (!validate()) {
            onSignupFailed();
            return;
        }

        btnSignup.setEnabled(false);

        String username = signupUsernameInput.getText().toString();
        String email = signupEmailInput.getText().toString();
        String password = signupPasswordInput.getText().toString();
        String reEnterPassword = signupReEnterPasswordInput.getText().toString();

        // TODO: Implement your own signup logic here.

        DataService dataService = DataService.getInstance();
        User user = dataService.signup(email, password, username);

        if (user == null) {
            onSignupFailed();
            return;
        }

        final ProgressDialog progressDialog = new ProgressDialog(SignupActivity.this,
                R.style.AppTheme);
        progressDialog.setIndeterminate(true);
        progressDialog.setMessage(getString(R.string.creating_acctount));
        progressDialog.show();

        new android.os.Handler().postDelayed(
                () -> {
                    // On complete call either onSignupSuccess or onSignupFailed
                    // depending on success
                    onSignupSuccess();
                    // onSignupFailed();
                    progressDialog.dismiss();
                }, 3000);
    }

    public void onSignupSuccess() {
        btnSignup.setEnabled(true);
        Intent intent = new Intent(SignupActivity.this, ModeSelectActivity.class);
        startActivity(intent);
    }

    public void onSignupFailed() {
        Toast.makeText(getBaseContext(), getString(R.string.login_failed), Toast.LENGTH_LONG).show();

        btnSignup.setEnabled(true);
    }

    public boolean validate() {
        boolean valid = true;

        String name = signupUsernameInput.getText().toString();
        String email = signupEmailInput.getText().toString();
        String password = signupPasswordInput.getText().toString();
        String reEnterPassword = signupReEnterPasswordInput.getText().toString();

        if (name.isEmpty() || name.length() < 3) {
            signupUsernameInput.setError(getString(R.string.name_length_error));
            valid = false;
        } else {
            signupUsernameInput.setError(null);
        }


        if (email.isEmpty() || !android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            signupEmailInput.setError(getString(R.string.enter_valid_email));
            valid = false;
        } else {
            signupEmailInput.setError(null);
        }


        if (password.isEmpty() || password.length() < 4 || password.length() > 10) {
            signupPasswordInput.setError(getString(R.string.password_length_error));
            valid = false;
        } else {
            signupPasswordInput.setError(null);
        }

        if (reEnterPassword.isEmpty() || reEnterPassword.length() < 4 || reEnterPassword.length() > 10 || !(reEnterPassword.equals(password))) {
            signupReEnterPasswordInput.setError(getString(R.string.password_do_not_match));
            valid = false;
        } else {
            signupReEnterPasswordInput.setError(null);
        }

        return valid;
    }

}

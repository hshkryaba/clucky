package com.studios.uio443.cluck.presentation.view.fragment;

import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.TextInputLayout;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.studios.uio443.cluck.presentation.R;
import com.studios.uio443.cluck.presentation.model.User;
import com.studios.uio443.cluck.presentation.services.DataService;
import com.studios.uio443.cluck.presentation.view.activity.LoginActivity;
import com.studios.uio443.cluck.presentation.view.activity.ModeSelectActivity;

import butterknife.BindView;
import butterknife.ButterKnife;

public class SignupFragment extends Fragment {

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

    public SignupFragment() {
        super();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_signup, container, false);
        ButterKnife.bind(this, view);

        btnSignup.setOnClickListener(v -> signup());

        linkLogin.setOnClickListener(v -> {
            Intent intent = new Intent(getContext(), LoginActivity.class);
            startActivity(intent);
            getActivity().overridePendingTransition(R.anim.push_left_in, R.anim.push_left_out);
        });

        return view;
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

        final ProgressDialog progressDialog = new ProgressDialog(getContext(), R.style.AppTheme);
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
        Intent intent = new Intent(getContext(), ModeSelectActivity.class);
        startActivity(intent);
    }

    public void onSignupFailed() {
        Toast.makeText(getContext(), getString(R.string.login_failed), Toast.LENGTH_LONG).show();

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

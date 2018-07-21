package com.studios.uio443.cluck.presentation.view.fragment;

import android.app.ProgressDialog;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.design.widget.TextInputLayout;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.studios.uio443.cluck.presentation.R;
import com.studios.uio443.cluck.presentation.mvp.SignupFragmentVP;
import com.studios.uio443.cluck.presentation.presenter.PresenterManager;
import com.studios.uio443.cluck.presentation.presenter.SignupFragmentPresenter;
import com.studios.uio443.cluck.presentation.util.Consts;

import butterknife.BindView;
import butterknife.ButterKnife;

public class SignupFragment extends BaseFragment implements SignupFragmentVP.View {
    SignupFragmentPresenter presenter;

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
    protected int getLayout() {
        return R.layout.fragment_signup;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        Log.d(Consts.TAG, "LoginFragment.onCreateView");
        super.onViewCreated(view, savedInstanceState);
        ButterKnife.bind(this, view);

        if (savedInstanceState == null) {
            presenter = new SignupFragmentPresenter();
        } else {
            presenter = PresenterManager.getInstance().restorePresenter(savedInstanceState);
        }
        presenter.bindView(this);

        btnSignup.setOnClickListener(v -> {
            String username = signupUsernameInput.getText().toString();
            String email = signupEmailInput.getText().toString();
            String password = signupPasswordInput.getText().toString();
            //String reEnterPassword = signupReEnterPasswordInput.getText().toString();

            presenter.onSignup(username, email, password);
        });

        linkLogin.setOnClickListener(v -> {
            presenter.linkLogin();
            getActivity().overridePendingTransition(R.anim.push_left_in, R.anim.push_left_out);
        });
    }

    @Override
    public void onResume() {
        super.onResume();

        presenter.bindView(this);
    }

    @Override
    public void onSaveInstanceState(@NonNull Bundle outState) {
        Log.d(Consts.TAG, "NoteFragment.onSaveInstanceState");
        super.onSaveInstanceState(outState);
        PresenterManager.getInstance().savePresenter(presenter, outState);
    }

    @Override
    public void onPause() {
        Log.d(Consts.TAG, "NoteFragment.onPause");
        super.onPause();

        presenter.unbindView();
    }

    @Override
    public void progressDialog() {
        final ProgressDialog progressDialog = new ProgressDialog(getActivity(), R.style.AppTheme);
        progressDialog.setIndeterminate(true);
        progressDialog.setMessage(getString(R.string.authenticating));
        progressDialog.show();

        new android.os.Handler().postDelayed(
                () -> {
                    // On complete call either onLoginSuccess or onLoginFailed
                    presenter.onSignupSuccess();
                    // onLoginFailed();
                    progressDialog.dismiss();
                }, 3000);
    }

    @Override
    public void showSignupSuccess() {
        btnSignup.setEnabled(true);
    }

    @Override
    public void showSignupFailed() {
        Toast.makeText(getActivity(), getString(R.string.login_failed), Toast.LENGTH_LONG).show();

        btnSignup.setEnabled(true);
    }

    @Override
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

    @Override
    public void setFragment(BaseFragment fragment) {
        try {
            //ataching to fragment the navigation presenter
            fragment.atachPresenter(presenter);
            //showing the presenter on screen
            replaceFragment(R.id.container, fragment);
        } catch (NullPointerException e) {
            Log.e(Consts.TAG, "LoginFragment.setFragment\n" + e.getMessage());
            e.printStackTrace();
        }
    }
}

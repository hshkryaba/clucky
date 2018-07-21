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
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import com.studios.uio443.cluck.presentation.R;
import com.studios.uio443.cluck.presentation.model.User;
import com.studios.uio443.cluck.presentation.services.DataService;
import com.studios.uio443.cluck.presentation.view.activity.ModeSelectActivity;
import com.vk.sdk.VKScope;
import com.vk.sdk.VKSdk;

import butterknife.BindView;
import butterknife.ButterKnife;

public class LoginFragment extends Fragment {

    private static final String[] sMyScope = new String[]{
            VKScope.FRIENDS,
            VKScope.WALL,
            VKScope.PHOTOS,
            VKScope.NOHTTPS,
            VKScope.MESSAGES,
            VKScope.DOCS
    };

    //используем butterknife
    //https://jakewharton.github.io/butterknife/
    //Обзор Butter Knife - https://startandroid.ru/ru/blog/470-butter-knife.html
    @BindView(R.id.login_email_layout)
    TextInputLayout loginEmailLayout;
    @BindView(R.id.login_password_layout)
    TextInputLayout loginPasswordLayout;
    @BindView(R.id.login_email_input)
    EditText loginEmailInput;
    @BindView(R.id.login_password_input)
    EditText loginPasswordInput;
    @BindView(R.id.sign_in_button)
    ImageButton btnSignIn;
    @BindView(R.id.btn_login)
    Button btnLogin;
    @BindView(R.id.link_signup)
    TextView linkSignUp;

    public LoginFragment() {
        super();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_login, container, false);
        ButterKnife.bind(this, view);

        //Если у пользователя не установлено приложение ВКонтакте,
        // то SDK будет использовать авторизацию через новую Activity при помощи OAuth.
        btnSignIn.setOnClickListener(v -> VKSdk.login(getActivity(), sMyScope));

        btnLogin.setOnClickListener(v -> login());

        linkSignUp.setOnClickListener(v -> showSignin());

        return view;
    }

    private void showSignin() {
        getActivity().getSupportFragmentManager()
                .beginTransaction()
                .replace(R.id.container, new SignupFragment())
                .commitAllowingStateLoss();
    }

    public void login() {

        Log.d("LoginActivity", "Loging in");

        if (!validate()) {
            onLoginFailed();
            return;
        }

        String email = loginEmailInput.getText().toString();
        String password = loginPasswordInput.getText().toString();

        // TODO: Implement your own authentication logic here.

        DataService dataService = DataService.getInstance();
        User user = dataService.authentication(email, password);

        dataService.testRest();

        if (user == null) {
            onLoginFailed();
            return;
        }

        btnLogin.setEnabled(false);

        final ProgressDialog progressDialog = new ProgressDialog(getContext(), R.style.AppTheme);
        progressDialog.setIndeterminate(true);
        progressDialog.setMessage(getString(R.string.authenticating));
        progressDialog.show();

        new android.os.Handler().postDelayed(
                () -> {
                    // On complete call either onLoginSuccess or onLoginFailed
                    onLoginSuccess();
                    // onLoginFailed();
                    progressDialog.dismiss();
                }, 3000);

    }

    public void onLoginSuccess() {
        btnLogin.setEnabled(true);
        Intent intent = new Intent(getContext(), ModeSelectActivity.class);
        startActivity(intent);
    }

    public void onLoginFailed() {
        Toast.makeText(getContext(), getString(R.string.login_failed), Toast.LENGTH_LONG).show();

        btnLogin.setEnabled(true);
    }

    public boolean validate() {
        boolean valid = true;

        String email = loginEmailInput.getText().toString();
        String password = loginPasswordInput.getText().toString();

        if (email.isEmpty() || !android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            loginEmailInput.setError(getString(R.string.enter_valid_email));
            valid = false;
        } else {
            loginEmailInput.setError(null);
        }

        if (password.isEmpty() || password.length() < 4 || password.length() > 10) {
            loginPasswordInput.setError(getString(R.string.password_length_error));
            valid = false;
        } else {
            loginPasswordInput.setError(null);
        }

        return valid;
    }
}

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
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import com.studios.uio443.cluck.presentation.R;
import com.studios.uio443.cluck.presentation.mvp.LoginFragmentVP;
import com.studios.uio443.cluck.presentation.presenter.LoginFragmentPresenter;
import com.studios.uio443.cluck.presentation.presenter.PresenterManager;
import com.studios.uio443.cluck.presentation.util.Consts;
import com.vk.sdk.VKScope;
import com.vk.sdk.VKSdk;

import butterknife.BindView;
import butterknife.ButterKnife;

public class LoginFragment extends BaseFragment implements LoginFragmentVP.View {

    LoginFragmentPresenter presenter;

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
    protected int getLayout() {
        return R.layout.fragment_login;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        Log.d(Consts.TAG, "LoginFragment.onViewCreated");
        super.onViewCreated(view, savedInstanceState);
        ButterKnife.bind(this, view);

        if (savedInstanceState == null) {
            presenter = new LoginFragmentPresenter();
        } else {
            presenter = PresenterManager.getInstance().restorePresenter(savedInstanceState);
        }
        presenter.bindView(this);

        //Если у пользователя не установлено приложение ВКонтакте,
        // то SDK будет использовать авторизацию через новую Activity при помощи OAuth.
        btnSignIn.setOnClickListener(v -> VKSdk.login(getActivity(), sMyScope));

        btnLogin.setOnClickListener(v -> {
            String email = loginEmailInput.getText().toString();
            String password = loginPasswordInput.getText().toString();

            presenter.onLogin(email, password);
        });

        linkSignUp.setOnClickListener(v -> presenter.onSignin());

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
                    presenter.onLoginSuccess();
                    // onLoginFailed();
                    progressDialog.dismiss();
                }, 3000);
    }

    @Override
    public void showLoginSuccess() {
        btnLogin.setEnabled(true);
    }


    @Override
    public void showLoginFailed() {
        Toast.makeText(getActivity(), getString(R.string.login_failed), Toast.LENGTH_LONG).show();

        btnLogin.setEnabled(true);
    }

    @Override
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

package com.studios.uio443.cluck.presentation.mvp;

import com.studios.uio443.cluck.presentation.view.fragment.BaseFragment;

public interface LoginFragmentVP {
    interface View {
        void setFragment(BaseFragment fragment);

        void startActivity(Class activityClass);

        void showLoginSuccess();

        void showLoginFailed();

        void progressDialog();

        boolean validate();
    }

    interface Presenter {

        void onLogin(String email, String password);

        void onSignin();

        void onLoginSuccess();

    }
}

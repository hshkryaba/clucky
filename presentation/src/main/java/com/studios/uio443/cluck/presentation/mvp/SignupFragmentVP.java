package com.studios.uio443.cluck.presentation.mvp;

import com.studios.uio443.cluck.presentation.view.fragment.BaseFragment;

public interface SignupFragmentVP {
    interface View {
        void setFragment(BaseFragment fragment);

        void startActivity(Class activityClass);

        void showSignupSuccess();

        void showSignupFailed();

        void progressDialog();

        boolean validate();
    }

    interface Presenter {

        void onSignup(String username, String email, String password);

        void linkLogin();

        void onSignupSuccess();
    }
}

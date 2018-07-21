package com.studios.uio443.cluck.presentation.presenter;

import android.annotation.SuppressLint;
import android.os.AsyncTask;
import android.support.annotation.NonNull;
import android.util.Log;

import com.studios.uio443.cluck.presentation.model.User;
import com.studios.uio443.cluck.presentation.model.UserHolder;
import com.studios.uio443.cluck.presentation.mvp.FragmentNavigation;
import com.studios.uio443.cluck.presentation.mvp.LoginFragmentVP;
import com.studios.uio443.cluck.presentation.services.DataService;
import com.studios.uio443.cluck.presentation.util.Consts;
import com.studios.uio443.cluck.presentation.view.activity.ModeSelectActivity;
import com.studios.uio443.cluck.presentation.view.fragment.BaseFragment;
import com.studios.uio443.cluck.presentation.view.fragment.SignupFragment;

public class LoginFragmentPresenter extends BasePresenter<UserHolder, LoginFragmentVP.View> implements
        LoginFragmentVP.Presenter,
        FragmentNavigation.Presenter {

    private boolean isLoadingData = false;

    @Override
    protected void updateView() {
        // Business logic is in the presenter
        //view().updateText(model.getText() + " " + count);
    }

    @Override
    public void bindView(@NonNull LoginFragmentVP.View view) {
        super.bindView(view);

        // Let's not reload data if it's already here
        if (model == null && !isLoadingData) {
            loadData();
        }
    }

    private void loadData() {
        isLoadingData = true;
        new LoadDataTask().execute();
    }

    @Override
    public void addFragment(BaseFragment fragment) {
        view().setFragment(fragment);
    }

    @Override
    public void onLogin(String email, String password) {
        Log.d(Consts.TAG, "LoginFragmentPresenter.onLogin");

        if (!view().validate()) {
            view().showLoginFailed();
            return;
        }

        // TODO: Implement your own authentication logic here.
        DataService dataService = DataService.getInstance();
        User user = dataService.authentication(email, password);

        dataService.testRest();

        if (user == null) {
            view().showLoginFailed();
            return;
        }
        view().showLoginSuccess();

        view().progressDialog();

    }

    @Override
    public void onSignin() {
        view().setFragment(new SignupFragment());
    }

    @Override
    public void onLoginSuccess() {
        view().showLoginSuccess();
        view().startActivity(ModeSelectActivity.class);
    }

    // It's OK for this class not to be static and to keep a reference to the Presenter, as this
    // is retained during orientation changes and is lightweight (has no activity/view reference)
    @SuppressLint("StaticFieldLeak")
    private class LoadDataTask extends AsyncTask<Void, Void, Void> {
        @Override
        protected Void doInBackground(Void... params) {
            //SystemClock.sleep(3000);
            //TODO получение данных из интернета
            return null;
        }

        @Override
        protected void onPostExecute(Void aVoid) {
            //setModel(new MainModel());
            isLoadingData = false;
        }
    }
}

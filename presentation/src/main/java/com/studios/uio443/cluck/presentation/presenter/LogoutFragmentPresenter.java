package com.studios.uio443.cluck.presentation.presenter;

import android.annotation.SuppressLint;
import android.os.AsyncTask;
import android.support.annotation.NonNull;

import com.studios.uio443.cluck.presentation.model.UserHolder;
import com.studios.uio443.cluck.presentation.mvp.FragmentNavigation;
import com.studios.uio443.cluck.presentation.mvp.LogoutFragmentVP;
import com.studios.uio443.cluck.presentation.view.activity.ModeSelectActivity;
import com.studios.uio443.cluck.presentation.view.fragment.BaseFragment;
import com.studios.uio443.cluck.presentation.view.fragment.LoginFragment;

public class LogoutFragmentPresenter extends BasePresenter<UserHolder, LogoutFragmentVP.View> implements
        LogoutFragmentVP.Presenter,
        FragmentNavigation.Presenter {

    private boolean isLoadingData = false;

    @Override
    protected void updateView() {
        // Business logic is in the presenter
        //view().updateText(model.getText() + " " + count);
    }

    @Override
    public void bindView(@NonNull LogoutFragmentVP.View view) {
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
    public void startModeSelectActivity() {
        view().startActivity(ModeSelectActivity.class);
    }

    @Override
    public void showLogin() {
        view().setFragment(new LoginFragment());
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

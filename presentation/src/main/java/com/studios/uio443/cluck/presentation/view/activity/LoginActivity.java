package com.studios.uio443.cluck.presentation.view.activity;

import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.util.Log;

import com.studios.uio443.cluck.presentation.R;
import com.studios.uio443.cluck.presentation.mvp.LoginActivityVP;
import com.studios.uio443.cluck.presentation.presenter.LoginActivityPresenter;
import com.studios.uio443.cluck.presentation.presenter.PresenterManager;
import com.studios.uio443.cluck.presentation.util.Consts;
import com.studios.uio443.cluck.presentation.view.fragment.BaseFragment;
import com.vk.sdk.VKAccessToken;
import com.vk.sdk.VKCallback;
import com.vk.sdk.VKSdk;
import com.vk.sdk.api.VKError;

public class LoginActivity extends BaseActivity implements
        LoginActivityVP.View {

    LoginActivityPresenter presenter;
    private boolean isResumed = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Log.d(Consts.TAG, "LoginActivity.onCreate");
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_start);

        if (savedInstanceState == null) {
            presenter = new LoginActivityPresenter();
        } else {
            presenter = PresenterManager.getInstance().restorePresenter(savedInstanceState);
        }
        presenter.bindView(this);

        VKSdk.wakeUpSession(this, new VKCallback<VKSdk.LoginState>() {
            @Override
            public void onResult(VKSdk.LoginState res) {
                if (isResumed) {
                    switch (res) {
                        case LoggedOut:
                            presenter.showLogin();
                            break;
                        case LoggedIn:
                            presenter.showLogout();
                            break;
                        case Pending:
                            break;
                        case Unknown:
                            break;
                    }
                }
            }

            @Override
            public void onError(VKError error) {
            }
        });

    }

    @Override
    protected void onResume() {
        super.onResume();
        presenter.bindView(this);
        isResumed = true;
        if (VKSdk.isLoggedIn()) {
            presenter.showLogout();
        } else {
            presenter.showLogin();
        }
    }

    @Override
    public void onSaveInstanceState(@NonNull Bundle outState) {
        Log.d(Consts.TAG, "LoginActivity.onSaveInstanceState");
        super.onSaveInstanceState(outState);

        PresenterManager.getInstance().savePresenter(presenter, outState);
    }

    @Override
    protected void onPause() {
        Log.d(Consts.TAG, "LoginActivity.onPause");
        isResumed = false;
        super.onPause();
        presenter.unbindView();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        VKCallback<VKAccessToken> callback = new VKCallback<VKAccessToken>() {
            @Override
            public void onResult(VKAccessToken res) {
                // User passed Authorization
                presenter.startModeSelectActivity();
            }

            @Override
            public void onError(VKError error) {
                // User didn't pass Authorization
            }
        };

        if (!VKSdk.onActivityResult(requestCode, resultCode, data, callback)) {
            super.onActivityResult(requestCode, resultCode, data);
        }
    }

    @Override
    public void setFragment(BaseFragment fragment) {
        try {
            //ataching to fragment the navigation presenter
            fragment.atachPresenter(presenter);
            //showing the presenter on screen
            replaceFragment(R.id.container, fragment);
        } catch (NullPointerException e) {
            Log.e(Consts.TAG, "LoginActivity.setFragment\n" + e.getMessage());
            e.printStackTrace();
        }
    }
}

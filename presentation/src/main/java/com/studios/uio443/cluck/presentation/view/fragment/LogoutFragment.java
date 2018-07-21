package com.studios.uio443.cluck.presentation.view.fragment;

import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.Log;
import android.view.View;
import android.widget.Button;

import com.studios.uio443.cluck.presentation.R;
import com.studios.uio443.cluck.presentation.mvp.LogoutFragmentVP;
import com.studios.uio443.cluck.presentation.presenter.LogoutFragmentPresenter;
import com.studios.uio443.cluck.presentation.presenter.PresenterManager;
import com.studios.uio443.cluck.presentation.util.Consts;
import com.vk.sdk.VKSdk;

import butterknife.BindView;
import butterknife.ButterKnife;

public class LogoutFragment extends BaseFragment implements LogoutFragmentVP.View {
    LogoutFragmentPresenter presenter;

    @BindView(R.id.continue_button)
    Button btnContinue;
    @BindView(R.id.logout)
    Button btnLogout;

    public LogoutFragment() {
        super();
    }

    @Override
    protected int getLayout() {
        return R.layout.fragment_logout;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        Log.d(Consts.TAG, "LoginFragment.onCreateView");
        super.onViewCreated(view, savedInstanceState);
        ButterKnife.bind(this, view);

        if (savedInstanceState == null) {
            presenter = new LogoutFragmentPresenter();
        } else {
            presenter = PresenterManager.getInstance().restorePresenter(savedInstanceState);
        }
        presenter.bindView(this);

        btnContinue.setOnClickListener(v -> presenter.startModeSelectActivity());

        btnLogout.setOnClickListener(v -> {
            VKSdk.logout();
            if (!VKSdk.isLoggedIn()) {
                presenter.showLogin();
            }
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

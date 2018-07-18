package com.studios.uio443.cluck.ui.fragments;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import com.studios.uio443.cluck.R;
import com.studios.uio443.cluck.ui.activities.ModeSelectActivity;
import com.vk.sdk.VKSdk;

import butterknife.BindView;
import butterknife.ButterKnife;

public class LogoutFragment extends Fragment {
    @BindView(R.id.continue_button)
    Button btnContinue;
    @BindView(R.id.logout)
    Button btnLogout;


    public LogoutFragment() {
        super();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_logout, container, false);
        ButterKnife.bind(this, view);

        btnContinue.setOnClickListener(v -> startModeSelectActivity());

        btnLogout.setOnClickListener(v -> {
            VKSdk.logout();
            if (!VKSdk.isLoggedIn()) {
                showLogin();
            }
        });
        return view;
    }

    private void startModeSelectActivity() {
        startActivity(new Intent(getContext(), ModeSelectActivity.class));
    }

    private void showLogin() {
        getActivity().getSupportFragmentManager()
                .beginTransaction()
                .replace(R.id.container, new LoginFragment())
                .commitAllowingStateLoss();
    }
}

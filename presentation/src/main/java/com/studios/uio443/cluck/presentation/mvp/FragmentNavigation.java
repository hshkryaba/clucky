package com.studios.uio443.cluck.presentation.mvp;

import com.studios.uio443.cluck.presentation.view.fragment.BaseFragment;

public interface FragmentNavigation {
    interface View {
        void atachPresenter(Presenter presenter);
    }

    interface Presenter {
        void addFragment(BaseFragment fragment);
    }
}

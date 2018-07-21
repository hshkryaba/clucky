package com.studios.uio443.cluck.presentation.adapter;

import android.support.annotation.NonNull;
import android.support.v7.widget.RecyclerView;

import com.studios.uio443.cluck.presentation.presenter.BasePresenter;
import com.studios.uio443.cluck.presentation.view.MvpViewHolder;

import java.util.HashMap;
import java.util.Map;

public abstract class MvpRecyclerAdapter<M, P extends BasePresenter, VH extends MvpViewHolder> extends RecyclerView.Adapter<VH> {
    protected final Map<Object, P> presenters;

    MvpRecyclerAdapter() {
        presenters = new HashMap<>();
    }

    @NonNull
    protected abstract P createPresenter(@NonNull M model);

    @NonNull
    protected P getPresenter(@NonNull M model) {
        System.err.println("Getting presenter for item " + getId(model));
        return presenters.get(getId(model));
    }

    @NonNull
    protected abstract Object getId(@NonNull M model);

    @Override
    public void onBindViewHolder(@NonNull VH holder, int position) {
        holder.bindPresenter(getPresenter(getItem(position)));
    }

    protected abstract M getItem(int position);

    @Override
    public void onViewRecycled(@NonNull VH holder) {
        super.onViewRecycled(holder);

        holder.unbindPresenter();
    }

    @Override
    public boolean onFailedToRecycleView(@NonNull VH holder) {
        // Sometimes, if animations are running on the itemView's children, the RecyclerView won't
        // be able to recycle the view. We should still unbind the presenter.
        holder.unbindPresenter();

        return super.onFailedToRecycleView(holder);
    }
}

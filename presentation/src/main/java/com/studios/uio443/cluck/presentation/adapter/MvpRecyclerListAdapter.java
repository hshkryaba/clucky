package com.studios.uio443.cluck.presentation.adapter;

import com.studios.uio443.cluck.presentation.presenter.BasePresenter;
import com.studios.uio443.cluck.presentation.view.MvpViewHolder;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public abstract class MvpRecyclerListAdapter<M, P extends BasePresenter, VH extends MvpViewHolder<P>> extends MvpRecyclerAdapter<M, P, VH> {
    private final List<M> list;

    MvpRecyclerListAdapter() {
        list = new ArrayList<>();
    }

    public void clearAndAddAll(Collection<M> data) {
        list.clear();
        presenters.clear();

        for (M item : data) {
            addInternal(item);
        }

        notifyDataSetChanged();
    }

    public void addAll(Collection<M> data) {
        for (M item : data) {
            addInternal(item);
        }

        int addedSize = data.size();
        int oldSize = list.size() - addedSize;
        notifyItemRangeInserted(oldSize, addedSize);
    }

    public void addItem(M item) {
        addInternal(item);
        notifyItemInserted(list.size());
    }

    public void updateItem(M item) {
        Object modelId = getId(item);

        // Swap the model
        int position = getItemPosition(item);
        if (position >= 0) {
            list.remove(position);
            list.add(position, item);
        }

        // Swap the presenter
        P existingPresenter = presenters.get(modelId);
        if (existingPresenter != null) {
            existingPresenter.setModel(item);
        }

        if (position >= 0) {
            notifyItemChanged(position);
        }
    }

    public void removeItem(M item) {
        int position = getItemPosition(item);
        if (position >= 0) {
            list.remove(item);
        }
        presenters.remove(getId(item));

        if (position >= 0) {
            notifyItemRemoved(position);
        }
    }

    public void removeAll() {
        list.clear();
        presenters.clear();

        notifyDataSetChanged();
    }

    private int getItemPosition(M item) {
        Object modelId = getId(item);

        int position = -1;
        for (int i = 0; i < list.size(); i++) {
            M model = list.get(i);
            if (getId(model).equals(modelId)) {
                position = i;
                break;
            }
        }
        return position;
    }

    private void addInternal(M item) {
        System.err.println("Adding item " + getId(item));
        list.add(item);
        presenters.put(getId(item), createPresenter(item));
    }

    @Override
    public int getItemCount() {
        return list.size();
    }

    @Override
    protected M getItem(int position) {
        return list.get(position);
    }
}

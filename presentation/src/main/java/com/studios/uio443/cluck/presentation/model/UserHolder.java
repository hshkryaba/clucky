package com.studios.uio443.cluck.presentation.model;

import android.util.Log;

import com.studios.uio443.cluck.presentation.util.Consts;

public class UserHolder {

    private static volatile UserHolder instance;
    private User currentUser;

    private UserHolder() {
    }

    public synchronized static UserHolder getInstance() {
        if (instance == null)
            instance = new UserHolder();
        return instance;
    }

    public int getId() {
        return currentUser.getId();
    }

    public User getCurrentUser() {
        Log.d(Consts.TAG, "UserHolder.getCurrentUser");
        return currentUser;
    }

    public void setCurrentUser(User currentUser) {
        this.currentUser = currentUser;
    }

    public void addUser(User newUser) {
        Log.d(Consts.TAG, "UserHolder.addUser");
        if (newUser == null) return;
    }

    public void deleteUser(int index) {
        Log.d(Consts.TAG, "UserHolder.deleteUser");
    }
}

package com.studios.uio443.cluck.presentation.model;

import java.io.Serializable;

public abstract class BaseModel implements Serializable {
    private int id;

    public BaseModel(int id) {
        this.id = id;
    }

    protected BaseModel() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}

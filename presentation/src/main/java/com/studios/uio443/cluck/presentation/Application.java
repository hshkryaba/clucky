/**
 * Copyright (C) 2015 Fernando Cejas Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.studios.uio443.cluck.presentation;

import android.content.Intent;
import android.widget.Toast;

import com.studios.uio443.cluck.presentation.internal.di.components.ApplicationComponent;
import com.studios.uio443.cluck.presentation.internal.di.components.DaggerApplicationComponent;
import com.studios.uio443.cluck.presentation.internal.di.modules.ApplicationModule;
import com.squareup.leakcanary.LeakCanary;
import com.studios.uio443.cluck.presentation.view.activity.LoginActivity;
import com.vk.sdk.VKAccessToken;
import com.vk.sdk.VKAccessTokenTracker;
import com.vk.sdk.VKSdk;

/**
 * Android Main Application
 */
public class Application extends android.app.Application {

  private ApplicationComponent applicationComponent;

  //Handling "AccessToken invalid"
  //Для обработки ситуаций, когда AccessToken становится невалиден (например, пользователь сменил пароль)
  VKAccessTokenTracker vkAccessTokenTracker = new VKAccessTokenTracker() {
    @Override
    public void onVKAccessTokenChanged(VKAccessToken oldToken, VKAccessToken newToken) {
      if (newToken == null) {
        // VKAccessToken is invalid
        Toast.makeText(Application.this, "AccessToken invalidated", Toast.LENGTH_LONG).show();
        Intent intent = new Intent(Application.this, LoginActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        startActivity(intent);
      }
    }
  };

  @Override public void onCreate() {
    super.onCreate();
    this.initializeInjector();
    this.initializeLeakDetection();

    vkAccessTokenTracker.startTracking();
    VKSdk.initialize(this);

  }

  private void initializeInjector() {
    this.applicationComponent = DaggerApplicationComponent.builder()
        .applicationModule(new ApplicationModule(this))
        .build();
  }

  public ApplicationComponent getApplicationComponent() {
    return this.applicationComponent;
  }

  private void initializeLeakDetection() {
    if (BuildConfig.DEBUG) {
      LeakCanary.install(this);
    }
  }
}

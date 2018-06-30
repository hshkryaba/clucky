/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux-immutable';
import { fromJS } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form/immutable';

import languageProviderReducer from 'containers/LanguageProvider/reducer';

/*
 * routeReducer
 *
 * The reducer merges route location changes into our immutable state.
 * The change is necessitated by moving to react-router-redux@4
 *
 */

// Initial routing state
const routeInitialState = fromJS({
  location: null,
});

/**
 * Merge route into the global application state
 */
function routeReducer(state = routeInitialState, action) {
  switch (action.type) {
    /* istanbul ignore next */
    case LOCATION_CHANGE:
      return state.merge({
        location: action.payload,
      });
    default:
      return state;
  }
}

function signUpReducer(state = { auth: false }, action) {
  function parseJwt(storageItem) {
    const token = JSON.parse(storageItem).jwt;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return window.atob(base64);
  }
  switch (action.type) {
    case 'INITIAL_AUTH':
      const item = localStorage.getItem('auth');
      return { auth: true, user: item, jwt: parseJwt(item) };
    case 'SUCCESS_AUTH':
      localStorage.setItem('auth', action.user);
      return { auth: true, user: localStorage.getItem('auth') };
    case 'LOGOUT':
      localStorage.removeItem('auth');
      return { auth: false };
    default:
      return state;
  }
}

/**
 * Creates the main reducer with the dynamically injected ones
 */
export default function createReducer(injectedReducers) {
  return combineReducers({
    route: routeReducer,
    signUp: signUpReducer,
    form: formReducer,
    language: languageProviderReducer,
    ...injectedReducers,
  });
}

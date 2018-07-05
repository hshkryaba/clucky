/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux-immutable';
import axios from 'axios';
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
    const base64Url = storageItem.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return window.atob(base64).replace(/\\"/g, '"');
  }
  switch (action.type) {
    case 'SUCCESS_AUTH':
      localStorage.setItem('auth', action.jwt);
      localStorage.setItem('refresh', action.refresh);
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + action.jwt;
      return { auth: true, jwt: action.jwt, parsedJwt: parseJwt(action.jwt), refresh: action.refresh };
    case 'LOGOUT':
      localStorage.removeItem('auth');
      axios.defaults.headers.common['Authorization'] = '';
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

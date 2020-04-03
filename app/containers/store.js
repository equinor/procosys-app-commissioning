import {
  AppState
} from 'react-native';
import {
  applyMiddleware,
  createStore
} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {persistStore, getStoredState, persistCombineReducers, createTransform } from 'redux-persist';
import {KEY_PREFIX} from 'redux-persist';
import {composeWithDevTools} from 'redux-devtools-extension';
import reducer from '../reducers';
import sagas from '../sagas';
import AsyncStorage from '@react-native-community/async-storage';

import {postToLog} from '../services/api';


let _store = null;
export default function store () {

  const SetTransform = createTransform(
  
    // transform state on its way to being serialized and persisted.
    (inboundState, key) => {
      let newState = { ...inboundState};
      delete newState.currentUser;
      return newState;
    },
    
    // transform state being rehydrated
    (outboundState, key) => {
      return outboundState;
    },
    
    // define which reducers this transform gets called for.
    {whitelist: ['Main']}
  );

  if (!_store) {

    const config = {
      key: 'primary',
      storage: AsyncStorage,
      transforms: [SetTransform],
      blacklist: ['Main']
    };
    
    const sagaMiddleware = createSagaMiddleware();

    const rootReducer = persistCombineReducers(config, {'Main': reducer});

    const logger = _store => next => action => {
      postToLog({'dispatching': action.type},action.type);
      return next(action);
    }

    _store = createStore(
      rootReducer, undefined,
      composeWithDevTools(
        applyMiddleware(sagaMiddleware),
        applyMiddleware(logger)
      )
    );


    persistStore(_store, null, () => {_store.getState()});

    sagaMiddleware.run(sagas);

    // Ensure that the pending data is applied when the app becomes active
    const handleChange = (nextAppState) => {

      if (nextAppState === 'active') {
      // TODO: use when implementing pin code
      }

    };

    AppState.addEventListener('change', handleChange);

  } else {

    console.log('store alrady created');

  }
  return _store;

}

export const getUserPersistConfig = (userkey) => ({
  'whitelist': ['schemaVersion'],
  'keyPrefix': `${userkey}_${KEY_PREFIX}`,
  'storage': AsyncStorage
});

export const getPersistedState = (config) =>
  new Promise((resolve, reject) => {

    getStoredState(
      config,
      (err, restoredState) => {

        if (err) {

          reject(err);

        } else {

          resolve(restoredState);

        }

      }
    );

  });

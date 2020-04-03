import {
  all
} from 'redux-saga/effects';

import {watchUserExpired} from './auth';
import {appWatcher, bookmarks} from './appData';

/*
 * Watchers
 */

const root = function *rootSaga () {

  yield all([
    watchUserExpired(),

    bookmarks(),
    appWatcher()

  ]);

};

export default root;

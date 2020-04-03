import { combineReducers } from 'redux';
import currentUser from './currentUser';
import schemaVersion from './manifest';
import version from './version';
import connectivity from './connectivity';
import searchPage from './searchPage';
import appData from './appData';
import packagePage from './packagePage';
import scopeItemPage from './scopeItemPage';
import punchItemPage from './punchItemPage';
import taskItemPage from './taskItemPage';
import newPunchPage from './newPunchPage';

export default combineReducers({
  schemaVersion,
  currentUser,
  version,
  connectivity,
  searchPage,
  appData,
  packagePage,
  scopeItemPage,
  punchItemPage,
  taskItemPage,
  newPunchPage
});

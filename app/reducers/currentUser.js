import { handleActions } from 'redux-actions';

import {USER_UPDATED} from '../actions';

const defaultState = null;

export default handleActions({
  [USER_UPDATED]: (state, action) => {
    if (action.payload) {return {...action.payload}}
    return null;
  }
}, defaultState);


const getCurrentUserRecucer = state => state.Main.currentUser;

export const getCurrentUser = state => getCurrentUserRecucer(state);
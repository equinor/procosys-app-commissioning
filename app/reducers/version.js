import { handleActions } from 'redux-actions';
import {
  setVersion,
  clearVersion,
  getVersionSucceeded
} from '../actions';

export default handleActions({
  
  [getVersionSucceeded]: (state, action) => ({
    current: action.payload,
  }),
  
  [clearVersion]: () => ({
    current: null,
  }),
}, { current: null });

export const getVersion = state =>(state.Main && state.Main.version) ? state.Main.version.current:"Unknown";

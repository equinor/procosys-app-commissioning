import { handleActions } from 'redux-actions';
import * as actions from '../actions';

const defaultState = {
    tasksSelected: false,
    punchesSelected :false,
    scopesSelected :true
    //dataSet: false
  };

export default handleActions({
  [actions.tasksSelected]: (state, action) => ({
    ...state,
    tasksSelected :true,
    punchesSelected :false,
    scopesSelected :false
 }),
 [actions.scopesSelected]: (state, action) => ({
    ...state,
    tasksSelected: false,
    punchesSelected :false,
    scopesSelected :true
 }),
 [actions.punchesSelected]: (state, action) => ({
    ...state,
    tasksSelected: false,
    punchesSelected :true,
    scopesSelected :false
 }),
 }, defaultState);

 const getData = state => state.Main.packagePage;

export const tasksSelected = state => getData(state).tasksSelected;
export const punchesSelected = state => getData(state).punchesSelected;
export const scopesSelected = state => getData(state).scopesSelected;

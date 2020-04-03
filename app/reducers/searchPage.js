import { handleActions } from 'redux-actions';

import * as actions from '../actions';


const defaultState = {
  data: null,
  dataSet: false
};

export default handleActions({
  [actions.searchPcsRequested]: (state, action) => ({
    ...state,
   ...action.payload,
   searching:true
 }),
 [actions.plantSet]: (state, action) => ({
   ...state,
  query:'',
  searchResult:null
}),
 [actions.searchPcsSucceeded]: (state, action) => ({
  ...state,
 ...action.payload,
 searching:false
}),
[actions.searchPcsFailed]: (state, action) => ({
  ...state,
 ...action.payload,
 searching:false
}),
[actions.projectSet]: (state, action) => ({
  ...state,
  query:'',
  searchResult:null
})
}, defaultState);


const getDefaultDataReducer = state => state.Main.searchPage;


export const getSearching = state => {
  return getDefaultDataReducer(state).searching;
}

export const getSearchResult = state => {
  return getDefaultDataReducer(state).searchResult;
}

export const getSearchFailed = state => {
  return getDefaultDataReducer(state).searchErrorMessage;
}

export const getQuery = state => {
  return getDefaultDataReducer(state).query;
}

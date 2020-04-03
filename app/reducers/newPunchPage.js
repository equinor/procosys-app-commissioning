
// Globally interesting data
import { handleActions } from 'redux-actions';
import * as actions from '../actions';

const defaultState = {
    thumbnails:[],
    thumbnailIds:[],
    thumbnailSaveRequested: false,
    newPunchCreateRequest: null,
    saved: false,
    newPunchCreateFailed: null,
    newPunch:{},
    newPunchCreateRequest: null,
    newPunchCreateRequestFailed:null,
    newPunchCreateResponse:null,
    //dataSet: false
  };

export default handleActions({

[actions.newPunchCreateRequest]: (state, action) => ({
  ...state,
  newPunchCreateRequest: action.payload
}),
[actions.newPunchCreateResponse]: (state, action) => ({
  ...state,
  saved: action.payload
}),

[actions.newPunchCreateFailed]: (state, action) => ({
  ...state,
  newPunchCreateFailed: action.payload
}),
[actions.checklistItemChanged]: (state, action) => ({
  ...state,
  newPunch:{},
  newPunchCreateRequest: null,
  newPunchCreateRequestFailed:null,
  newPunchCreateResponse:null,
  thumbnails:[],
  thumbnailIds:[],
  saved: false
}),


[actions.newPunchTmpAttachmentSaveRequest]: (state, action) => ({
  ...state,
  thumbnailSaveRequested:true,


}),
[actions.newPunchTmpAttachmentSaveResponse]: (state, action) =>({
  ...state,
  thumbnailSaveRequested:false,
  thumbnailIds:[...state.thumbnailIds, action.payload.Id],
  
}),
[actions.newPunchTmpAttachmentSaveRequestFailed]: (state, action) => { 
  return {
  ...state,
  thumbnailSaveRequested:false,
  thumbnailSaveRequestFailed:action.payload,

}},

[actions.punchMetadataRequest]: (state, action) => ({
  ...state,
  metadataRequested:true,
  metadata:null,

}),

[actions.punchMetadataRequestFailed]: (state, action) => ({
  ...state,
  metadataRequested:false,
  metadataFailed:action.payload,

}),
[actions.punchMetadataResponse]: (state, action) => ({
  ...state,
  metadataRequested:false,
  metadata:action.payload,

}),


}, defaultState);


const getAppData = state => state.Main.newPunchPage;

export const newPunchCreateRequest = state => getAppData(state).newPunchCreateRequest;
export const newPunchCreateRequestFailed = state => getAppData(state).newPunchCreateRequestFailed;
export const newPunchCreateResponse = state => getAppData(state).newPunchCreateResponse;

export const saved = state => getAppData(state).saved;
export const newPunch = state => getAppData(state).newPunch;
export const checklistChangedFailed = state => getAppData(state).checklistChangedFailed;

export const thumbnails = state => getAppData(state).thumbnails;
export const thumbnailIds = state => getAppData(state).thumbnailIds;
export const thumbnailSaveRequested = state => getAppData(state).thumbnailSaveRequested;
export const thumbnailSaveRequestFailed = state => getAppData(state).thumbnailSaveRequested;


export const metadata = state => getAppData(state).metadata;

export const metadataRequested = state => getAppData(state).metadataRequested;
export const metadataFailed = state => getAppData(state).metadataFailed;

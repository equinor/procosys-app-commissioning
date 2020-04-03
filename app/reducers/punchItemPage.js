
// Globally interesting data
import { handleActions } from 'redux-actions';
import * as actions from '../actions';
import _ from 'lodash';
const defaultState = {
  newPunch: false,
  punch:null,
  fetchingPunch: true,
  thumbnails:null,
  thumbnailsRequested: false,
  refreshThumbnails:false,
  tmpThumbnails: [],
  justLoaded: false,
  error:null,
  changing:false,
  verified:false,
  fileRequested:false,
  attachment:null,
  attachmentDeleting:false,
  metadataRequested:false,
  metadata:null,
};

export default handleActions({

  [actions.setNewPunch]: (state, action) => ({
    ...state,

    newPunch: true,
    thumbnails:null,
    thumbnailsRequested: false,
    justLoaded: true,
    error:null,
    verified:false,
    tmpThumbnails: [],

    punch: {
      ChecklistId: action.payload.Id,
      SystemModule: action.payload.SystemModule,
      TagNo: action.payload.TagNo,
      TagDescription: action.payload.TagDescription
    }

  }),
  [actions.setPunch]: (state, action) => {
    const newlyFetchedPunch = action.payload;
    const newState = {
      ...state,
      punch: newlyFetchedPunch,
      newPunch: false,
      error:null,
      changing:false,
      verified:false,
      tmpThumbnails: [],
      fetchingPunch: false,
    }
    if (state.punch && state.punch.Id != newlyFetchedPunch.Id) {
      newState.thumbnailsRequested = false;
      newState.refreshThumbnails = true;
      newState.thumbnails = null;

    }

    return newState;
  },
  [actions.attachmentsRequestPunch]: (state, action) => ({
  ...state,
  thumbnailsRequested:true,
  thumbnails:null,
  justLoaded: false

}),
[actions.attachmentsResponsePunch]: (state, action) => ({
  ...state,
  thumbnailsRequested:false,
  thumbnails:action.payload.thumbnails,
  refreshThumbnails:false

}),
[actions.newPunchTmpAttachmentSaveResponse]: (state, action) => ({
  ...state,
  tmpThumbnails: [...state.tmpThumbnails, action.payload],
  changing:false,
  attachmentSaving: false

}),
[actions.newPunchTmpAttachmentSaveRequest]: (state, action) => ({
  ...state,
  changing:true,
  attachmentSaving: true
}),
[actions.newPunchTmpAttachmentDeleteRequest]: (state, action) => {
  var tmpThumbnails = [];
  for (var i = 0; i < state.tmpThumbnails.length; i++) {
    if (state.tmpThumbnails[i].Id !== action.payload.Id){
      tmpThumbnails.push(state.tmpThumbnails[i]);
    }
  }
  return {
  ...state,
  tmpThumbnails: [...tmpThumbnails]
}}
,
[actions.attachmentRequestPunch]: (state, action) => ({
  ...state,
  fileRequested:true,
  attachment:null

}),
[actions.attachmentResponsePunch]: (state, action) => ({
  ...state,
  fileRequested:false,
  attachment:action.payload

}),
[actions.attachmentsRequestFailedPunch]: (state, action) => ({
  ...state,
  thumbnailsRequested:false,
  thumbnails:null

}),

[actions.attachmentDeleteRequestPunch]: (state, action) => ({
  ...state,
  attachmentDeleting:true,
}),

[actions.attachmentDeleteOkResponsePunch]: (state, action) => ({
  ...state,
  attachmentDeleting:false,
  thumbnailsRequested:false,
  thumbnails:null,
  refreshThumbnails:true
}),

[actions.attachmentDeleteFailedResponsePunch]: (state, action) => ({
  ...state,
  attachmentDeleting:false,
}),


[actions.attachmentSaveRequestPunch]: (state, action) => ({
  ...state,
  attachmentSaving:true,
}),

[actions.attachmentSaveOkResponsePunch]: (state, action) => ({
  ...state,
  attachmentSaving:false,
  thumbnailsRequested:false,
  thumbnails:null,
  refreshThumbnails:true
}),

[actions.attachmentSavedFailedResponsePunch]: (state, action) => ({
  ...state,
  attachmentSaving:false,

}),

[actions.punchClearRequest]: (state, action) => ({
  ...state,
  changing:true,

}),
[actions.punchUnClearRequest]: (state, action) => ({
  ...state,
  changing:true,

}),
[actions.punchRejectRequest]: (state, action) => ({
  ...state,
  changing:true,

}),
[actions.punchVerifyRequest]: (state, action) => ({
  ...state,
  changing:true,

}),

[actions.punchChanged]: (state, action) => ({
  ...state,
  punchChanged:{...action.payload},
  changing:false,
  error:null,

}),
[actions.punchChangedFailed]: (state, action) => ({
  ...state,
  punchChangedFailed:{...action.payload},
  changing:false,
  error:action.payload.message,

}),
[actions.punchChanged]: (state, action) => ({
  ...state,
  error:null,
  changing:false,


}),
[actions.punchIsVerified]: (state, action) => ({
  ...state,
  error:null,
  changing:false,
  punch:null,
  verified:true
}),
[actions.punchRequest]: (state, action) => ({
  ...state,
  punch: null,
  fetchingPunch: true
}),
[actions.punchFailed]: (state, action) => ({
  ...state,
  fetchingPunch: false,
}),
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


const getAppData = state => state.Main.punchItemPage;


export const thumbnails = state => getAppData(state).thumbnails;
export const thumbnailsRequested = state => getAppData(state).thumbnailsRequested;

export const attachment = state => getAppData(state).attachment;
export const fileRequested = state => getAppData(state).fileRequested;


export const attachmentSaving = state => getAppData(state).attachmentSaving;
export const attachmentDeleting = state => getAppData(state).attachmentDeleting;
export const refreshThumbnails = state => getAppData(state).refreshThumbnails;
export const justLoaded = state => getAppData(state).justLoaded;
export const newPunch = state => getAppData(state).newPunch;
export const punch = state => getAppData(state).punch;

export const punchChangedFailed = state => getAppData(state).punchChangedFailed;
export const punchChanged = state => getAppData(state).punchChanged;
export const changing = state => getAppData(state).changing;
export const error = state => getAppData(state).error;
export const verified = state => getAppData(state).verified;

export const isFetching = state => getAppData(state).fetchingPunch;

export const tmpThumbnails = state => getAppData(state).tmpThumbnails;
export const tmpAttachments = state => getAppData(state).tmpThumbnails;

export const metadata = state => getAppData(state).metadata;
export const metadataRequested = state => getAppData(state).metadataRequested;

//export const attachmentSaved = state => getAppData(state).attachmentSaved;


// Globally interesting data
import { handleActions } from 'redux-actions';
import * as actions from '../actions';

const defaultState = {
  checklistItemChanged: null,
  checklistItemChangedFailed: null,
  thumbnails: null,
  thumbnailsRequested: false,
  refreshThumbnails: false,
  attachmentSaving: false,
  attachment: null,
  fileRequested: false
};

export default handleActions({

[actions.checklistItemChangeRequest]: (state, action) => ({
  ...state,
  checklistItemChangeRequest: action.payload
}),
[actions.checklistItemChanged]: (state, action) => ({
  ...state,
  checklistItemChanged: action.payload
}),
[actions.checklistItemChangedFailed]: (state, action) => ({
  ...state,
  checklistItemChangedFailed: action.payload
}),


[actions.checklistChangeRequest]: (state, action) => ({
  ...state,
  checklistChangeRequest: action.payload
}),
[actions.checklistChanged]: (state, action) => ({
  ...state,
  checklistChanged: action.payload
}),
[actions.checklistChangedFailed]: (state, action) => ({
  ...state,
  checklistChangedFailed: action.payload
}),
[actions.setScope]: (state, action) => ({
  ...state,
  checklistItemChanged:null,
  checklistItemChangedFailed:null,
  checklistChanged: null,
  checklistChangedFailed: null,
  thumbnails:null,
  thumbnailsRequested: false

}),
[actions.attachmentsRequest]: (state, action) => ({
  ...state,
  thumbnailsRequested:true,
  thumbnails:null

}),
[actions.attachmentsResponse]: (state, action) => ({
  ...state,
  thumbnailsRequested:false,
  thumbnails:action.payload.thumbnails,
  refreshThumbnails:false

}),
[actions.attachmentRequest]: (state, action) => ({
  ...state,
  fileRequested:true,
  attachment:null

}),
[actions.attachmentResponse]: (state, action) => ({
  ...state,
  fileRequested:false,
  attachment:action.payload

}),
[actions.attachmentsRequestFailed]: (state, action) => ({
  ...state,
  thumbnailsRequested:false,
  thumbnails:null

}),

[actions.attachmentDeleteRequest]: (state, action) => ({
  ...state,
  attachmentDeleting:true,
}),

[actions.attachmentDeleteOkResponse]: (state, action) => ({
  ...state,
  attachmentDeleting:false,
  thumbnailsRequested:false,
  thumbnails:null,
  refreshThumbnails:true
}),

[actions.attachmentDeleteFailedResponse]: (state, action) => ({
  ...state,
  attachmentDeleting:false,
}),


[actions.attachmentSaveRequest]: (state, action) => ({
  ...state,
  attachmentSaving:true,
}),

[actions.attachmentSaveOkResponse]: (state, action) => ({
  ...state,
  attachmentSaving:false,
  thumbnailsRequested:false,
  thumbnails:null,
  refreshThumbnails:true
}),

[actions.attachmentSavedFailedResponse]: (state, action) => ({
  ...state,
  attachmentSaving:false,

}),

}, defaultState);


const getAppData = state => state.Main.scopeItemPage;

export const checklistItemChangeRequest = state => {
  return getAppData(state).checkListItemChangeRequest
};
export const checklistItemChanged = state => getAppData(state).checklistItemChanged;
export const checklistItemChangedFailed = state => getAppData(state).checklistItemChangedFailed;

export const checklistChangeRequest = state => getAppData(state).checkListChangeRequest;
export const checklistChanged = state => getAppData(state).checklistChanged;
export const checklistChangedFailed = state => getAppData(state).checklistChangedFailed;

export const thumbnails = state => getAppData(state).thumbnails;
export const thumbnailsRequested = state => getAppData(state).thumbnailsRequested;

export const attachment = state => getAppData(state).attachment;
export const fileRequested = state => getAppData(state).fileRequested;


export const attachmentSaving = state => getAppData(state).attachmentSaving;
export const attachmentDeleting = state => getAppData(state).attachmentDeleting;
export const refreshThumbnails = state => getAppData(state).refreshThumbnails;
//export const attachmentSaved = state => getAppData(state).attachmentSaved;

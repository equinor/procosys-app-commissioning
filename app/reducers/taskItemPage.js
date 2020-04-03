
// Globally interesting data
import { handleActions } from 'redux-actions';
import * as actions from '../actions';

const defaultState = {
    taskSelected:true,
    parametersSelected: false,
    attachmentsSelected: false
  };

export default handleActions({

  [actions.setTask]: (state, action) => ({
    ...state,
    /*thumbnails:null,
    thumbnailsRequested: false,
    justLoaded: true*/

  }),
  [actions.taskTaskSelected]: (state, action) => ({
    ...state,
    taskSelected:true,
    parametersSelected: false,
    attachmentsSelected: false

  }),
  [actions.taskAttachmentRequest]: (state, action) => ({
    ...state,
    fileRequested:true,
    attachment:null

  }),
  [actions.taskAttachmentResponse]: (state, action) => ({
    ...state,
    fileRequested:false,
    attachment:action.payload

  }),
  [actions.taskParametersSelected]: (state, action) => ({
    ...state,
    taskSelected:false,
    parametersSelected: true,
    attachmentsSelected: false

  }),
  [actions.taskAttachmentsSelected]: (state, action) => ({
    ...state,
    taskSelected:false,
    parametersSelected: false,
    attachmentsSelected: true

  })
}, defaultState);

const getData = state => state.Main.taskItemPage;


export const attachmentsSelected = state => getData(state).attachmentsSelected;
export const parametersSelected = state => getData(state).parametersSelected;
export const taskSelected = state => getData(state).taskSelected;
export const attachment = state => getData(state).attachment;
export const fileRequested = state => getData(state).fileRequested;

//export const attachmentSaved = state => getAppData(state).attachmentSaved;

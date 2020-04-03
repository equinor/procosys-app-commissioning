/**
 * with normal sideeffects: PENDING, FULFILLED, REJECTED
 * with ajax calls: REQUESTED, SUCCEEDED, FAILED
 */

import { createAction } from 'redux-actions';
import { authStatusTypes } from '../types';

/**
 * User
 */
export const setCurrentUser = createAction('User/CURRENT_SET');
export const onboarding = createAction('User/Onboarding');
export const onboarded = createAction('User/Onboarded');

export const permissions = createAction('User/Permissions')
export const permissionsRequested = createAction('User/PermissionsRequested')
export const permissionsFailed = createAction('User/PermissionsFailed')

/**
 * Auth
 */
export const USER_UPDATED = createAction('Auth/USER_UPDATED', userinfo => userinfo);
export const ACCESS_TOKEN_RECEIVED = createAction('Auth/ACCESS_TOKEN_RECEIVED', token => token);
export const USER_LOGGED_IN = createAction('Auth/USER_LOGGED_IN');
export const USER_LOGGED_OUT = createAction('Auth/USER_LOGGED_OUT');
export const USER_EXPIRED = createAction('Auth/USER_EXPIRED');
export const USER_WILL_EXPIRE = createAction('Auth/USER_WILL_EXPIRE');

/**
 * Version
 */
export const clearVersion = createAction('Version/CLEAR_ALL');
export const getVersionRequested = createAction('Version/REQUEST');
export const getVersionSucceeded = createAction('Version/SUCCESS');
export const setVersion = createAction('Version/SET');

/**
 * Default page
 */
export const defaultSetData = createAction('Default/SET_TEST_DATA', data => ({
  data: data,
  dataSet:true
}));

export const generalError = createAction('General/ERROR', payload => ({ ...payload }));

export const searchPcsRequested = createAction('Pcs/SEARCH_REQUESTED', payload => ({ ...payload, fetching: true }));
export const searchPcsSucceeded = createAction('Pcs/SEARCH_SUCCEDED', payload => ({ ...payload, fetching: false }));
export const searchPcsFailed = createAction('Pcs/SEARCH_FAILED', payload => ({...payload, fetching: false }));
export const postFeedback = createAction('Pcs/POST_FEEDBACK', payload => ({...payload }));

export const loadPcs = createAction('Pcs/LOAD_REQUESTED', payload => ({...payload, fetching: true }));
export const loadPcsSucceeded = createAction('Pcs/LOAD_SUCCEEDED', payload => ({...payload, fetching: false }));
export const loadPcsFailed = createAction('Pcs/LOAD_FAILED', payload => ({...payload, fetching: false }));

export const scopeRequest = createAction('Scope/LOAD_REQUESTED', payload => ({...payload, fetchingScope: true }));
export const setScope = createAction('PackagePage/setScope', (scope) => ({ ...scope }));
export const scopeFailed = createAction('Scope/LOAD_FAILED', payload => ({...payload, fetchingScope: false }));

export const punchRequest = createAction('Punch/LOAD_REQUESTED', payload => ({...payload, fetchingPunch: true }));
export const setPunch = createAction('PackagePage/setPunch', (punch) => ({ ...punch }));
export const punchFailed = createAction('Punch/LOAD_FAILED', payload => ({...payload, fetchingPunch: false }));

export const taskRequest = createAction('Task/LOAD_REQUESTED', payload => ({...payload, fetchingTask: true }));
export const setTask = createAction('PackagePage/setTask', (task) => ({ ...task }));
export const taskFailed = createAction('Task/LOAD_FAILED', payload => ({...payload, fetchingTask: false }));


export const addBookmark = createAction('Bookmark/ADD', (payload, tmp) => ({...payload,tmp:tmp })); //Tmp is set if needs a commit before reflected
export const addBookmarkFinished = createAction('Bookmark/ADD_FINISHED', () => ({}));
export const removeBookmark = createAction('Bookmark/REMOVE',(payload,tmp) => ({...payload,tmp:tmp }));
export const removeBookmarkFinished = createAction('Bookmark/REMOVE_FINISHED', () => ({ }));
export const allBookmarkedRequested = createAction('Bookmark/ALL_REQUESTED', () => ({}));
export const allBookmarkedReturned = createAction('Bookmark/ALL_RETURNED', (payload) => ({allBookmarked : payload }));


export const commitBookmarks = createAction('Bookmark/COMMIT', () => ({}));


export const plantRequest = createAction('Appdata/PLANT_REQUESTED', () => ({requested:true }));
export const plantReturned = createAction('Appdata/PLANT_SUCCEDED', payload => ({...payload,requested:false }));
export const plantNotSet = createAction('Appdata/PLANT_NOTSET', payload => ({...payload }));
export const plantSet = createAction('Appdata/PLANT_SET', payload => ({...payload }));
export const allPlantsRequested = createAction('Appdata/ALLPLANTS_REQUESTED', payload => ({...payload, requested:true }));
export const allPlantsReturned = createAction('Appdata/ALLPLANTS_RETURNED', payload => ({allPlants: payload, requested:false }));

export const projectsRequest = createAction('Appdata/PROJECTS_REQUESTED', () => ({}));
export const projectsRequested = createAction('Appdata/PROJECTS_REQUESTEDED', () => ({}));
export const projectsReturned = createAction('Appdata/PROJECTS_SUCCEDED', payload => ({...payload }));
export const projectsFailed = createAction('Appdata/PROJECTS_FAILED', payload => ({...payload }));
export const projectNotSet = createAction('Appdata/PROJECT_NOTSET', payload => ({...payload }));
export const projectSet = createAction('Appdata/PROJECT_SET', payload => ({...payload }));
export const projectNewSet = createAction('Appdata/PROJECT_NEW_SET', payload => ({...payload }));


/* Package page */
export const scopesSelected = createAction('PackagePage/scopes_selected', () => ({ }));

export const tasksSelected = createAction('PackagePage/tasks_selected', () => ({ }));

export const punchesSelected = createAction('PackagePage/punches_selected', () => ({ }));

/* Scope item */
export const checklistItemChangeRequest = createAction('ScopeItem/ItemChangedRequest', payload => ({...payload}));
export const checklistItemChanged = createAction('ScopeItem/ItemChanged', payload => ({...payload}));
export const checklistItemChangedFailed = createAction('ScopeItem/ItemChangedFailed', payload => ({...payload}));

export const checklistSignRequest = createAction('ScopeItem/ListSignRequest', payload => ({...payload}));
export const checklistUnsignRequest = createAction('ScopeItem/ListUnsignRequest', payload => ({...payload}));
export const checklistCommentRequest = createAction('ScopeItem/ListCommentRequest', payload => ({...payload}));

export const checklistChanged = createAction('ScopeItem/ListChanged', payload => ({...payload}));
export const checklistChangedFailed = createAction('ScopeItem/ListChangedFailed', payload => ({...payload}));

export const attachmentsRequest = createAction('Item/AttachmentsRequest', payload => ({...payload}));
export const attachmentsFailed = createAction('Item/AttachmentsRequestFailed', payload => ({...payload}));
export const attachmentsResponse = createAction('Item/AttachmentsResponse', payload => ({...payload}));

export const attachmentRequest = createAction('Item/AttachmentRequest', payload => ({...payload}));
export const attachmentRequestFailed = createAction('Item/AttachmentRequestFailed', payload => ({...payload}));
export const attachmentResponse = createAction('Item/AttachmentResponse', payload => ({...payload}));

export const attachmentSaveRequest = createAction('Item/AttachmentSaveRequest', payload => ({...payload}));
export const attachmentSaveOkResponse = createAction('Item/AttachmentSaveOkResponse', payload => ({...payload}));
export const attachmentSaveFailedResponse = createAction('Item/AttachmentSaveFailedResponse', payload => ({...payload}));

export const attachmentDeleteRequest = createAction('Item/AttachmentDeleteRequest', payload => ({...payload}));
export const attachmentDeleteOkResponse = createAction('Item/AttachmentDeleteOkResponse', payload => ({...payload}));
export const attachmentDeleteFailedResponse = createAction('Item/AttachmentDeleteFailedResponse', payload => ({...payload}));


export const attachmentsRequestPunch = createAction('Item/AttachmentsRequestPunch', payload => ({...payload}));
export const attachmentsFailedPunch = createAction('Item/AttachmentsRequestFailedPunch', payload => ({...payload}));
export const attachmentsResponsePunch = createAction('Item/AttachmentsResponsePunch', payload => ({...payload}));

export const attachmentRequestPunch = createAction('Item/AttachmentRequestPunch', payload => ({...payload}));
export const attachmentRequestFailedPunch = createAction('Item/AttachmentRequestFailedPunch', payload => ({...payload}));
export const attachmentResponsePunch = createAction('Item/AttachmentResponsePunch', payload => ({...payload}));

export const attachmentSaveRequestPunch = createAction('Item/AttachmentSaveRequestPunch', payload => ({...payload}));
export const attachmentSaveOkResponsePunch = createAction('Item/AttachmentSaveOkResponsePunch', payload => ({...payload}));
export const attachmentSaveFailedResponsePunch = createAction('Item/AttachmentSaveFailedResponsePunch', payload => ({...payload}));

export const attachmentDeleteRequestPunch = createAction('Item/AttachmentDeleteRequestPunch', payload => ({...payload}));
export const attachmentDeleteOkResponsePunch = createAction('Item/AttachmentDeleteOkResponsePunch', payload => ({...payload}));
export const attachmentDeleteFailedResponsePunch = createAction('Item/AttachmentDeleteFailedResponsePunch', payload => ({...payload}));

/* Task page */
export const taskTaskSelected = createAction('TaskPage/tasks_selected', () => ({ }));
export const taskAttachmentsSelected = createAction('TaskPage/attachments_selected', () => ({ }));
export const taskParametersSelected = createAction('TaskPage/parameters_selected', () => ({ }));

export const taskSignRequest = createAction('TaskPage/sign', (task) => ({...task }));
export const taskUnsignRequest = createAction('TaskPage/unsign', (task) => ({...task }));
export const taskCommentRequest = createAction('TaskPage/comment', (task) => ({...task }));
export const taskParameterRequest = createAction('TaskPage/parameters_changed', (task) => ({...task }));
export const taskChanged = createAction('TaskPage/TaskChanged', payload => ({...payload}));
export const taskChangedFailed = createAction('TaskItem/TaskChangedFailed', payload => ({...payload}));
export const taskAttachmentRequest = createAction('TaskItem/taskAttachmentRequest', payload => ({...payload}));
export const taskAttachmentResponse = createAction('TaskItem/taskAttachmentResponse', payload => ({...payload}));

export const setNewPunch = createAction('Punch/setNewPunch', payload => ({...payload}));
export const newPunchCreateRequest = createAction('Punch/newPunchCreateRequest', payload => ({...payload}));
export const newPunchCreateResponse = createAction('Punch/newPunchCreateResponse', payload => ({...payload}));
export const newPunchCreateFailed = createAction('Punch/newPunchCreateFailed', payload => ({...payload}));

export const newPunchTmpAttachmentSaveRequest = createAction('Punch/newPunchTmpAttachmentSaveRequest', payload => ({...payload}));
export const newPunchTmpAttachmentSaveResponse = createAction('Punch/newPunchTmpAttachmentSaveResponse', payload => ({...payload}));
export const newPunchTmpAttachmentSaveRequestFailed = createAction('Punch/newPunchTmpAttachmentSaveRequestFailed', payload => ({...payload}));
export const newPunchTmpAttachmentDeleteRequest = createAction('Punch/newPunchTmpAttachmentDeleteRequest', payload => ({...payload}));

export const punchMetadataRequest = createAction('Punch/punchMetadataRequest', payload => ({...payload}));
export const punchMetadataRequestFailed = createAction('Punch/punchMetadataRequestFailed', payload => ({...payload}));
export const punchMetadataResponse = createAction('Punch/punchMetadataResponse', payload => ({...payload}));

export const punchClearRequest = createAction('Punch/punchClearRequest', payload => ({...payload}));
export const punchUnClearRequest = createAction('Punch/punchUnClearRequest', payload => ({...payload}));
export const punchRejectRequest = createAction('Punch/punchRejectRequest', payload => ({...payload}));
export const punchVerifyRequest = createAction('Punch/punchVerifyRequest', payload => ({...payload}));
export const punchChanged = createAction('Punch/punchChanged', payload => ({...payload}));
export const punchChangedFailed = createAction('Punch/punchChangedFailed', payload => ({...payload}));
export const punchUpdateRequest = createAction('Punch/punchUpdateRequest', payload => ({...payload}));
export const punchIsVerified = createAction('Punch/punchIsVerified', payload => ({...payload}));

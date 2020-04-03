import { call, put, takeEvery, takeLatest, all} from 'redux-saga/effects'

import * as api from '../services/api';
import { delay } from 'redux-saga';
import * as actions from '../actions'
import NavigationService from '../services/NavigationService';
import _ from 'lodash';
import {randomString, getExtension} from '../utils/misc';
import * as mime from 'react-native-mime-types';
import { track, metricKeys } from '../utils/metrics';
import StorageService from '../services/StorageService';

let appStore = StorageService;
const config = {
    userName : '',
    currentPackage:null,
    plant: {Id:'notSet'}
}

const bookmarkKey = 'commissioning.bookmarks.user.';
const plantKey = 'commissioning.mainPlant.user.';
const versionKey = 'commissioning.appVersion.user.';
const projectKey = 'commissioning.project.user.';

const getBookmarks = () => {
    return appStore.getData(bookmarkKey + "_" + config.plant.Id);
};
const setBookmarks = (bookmarks) => appStore.setData(bookmarkKey + "_" + config.plant.Id, bookmarks);

const getProject = () => {
    return appStore.getData(projectKey + '_'+ config.plant.Id);
};
const saveProject = (project) => appStore.setData(projectKey + '_' + config.plant.Id, project);



function* addBookmark(action) {
    try {

        const bookmarks = (yield call(() => getBookmarks())) || [];

       if (action.payload.tmp){ //Dont actually remove
        var existing = _.find(bookmarks, (item)=> item.Id === action.payload.Id);
        if (existing){
            existing.removed = false;
            yield call(() => setBookmarks(bookmarks));
            yield put(actions.allBookmarkedReturned(bookmarks));
        }
        return;
       }

        var newBookmark = {...action.payload};

       if (!_.find(bookmarks, (item)=> item.Id === newBookmark.Id)){
            bookmarks.push(newBookmark);
            yield call(() => setBookmarks(bookmarks));
            //yield call(() => appStore.set(bookmarkKey+ '_' + config.userName,bookmarks));
       }

       yield put(actions.addBookmarkFinished());
       yield put(actions.allBookmarkedReturned(bookmarks));

    } catch (e) {
      yield* requestErrorHandling(e, null, action.payload);
    }
 }
 function* removeBookmark(action) {
    try {
        const bookmarks = (yield call(() => getBookmarks())) || [];

        if (action.payload.tmp){ //Dont actually remove
            var existing = _.find(bookmarks, (item)=> item.Id === action.payload.Id);
            if (existing){
                existing.removed = true;
                yield call(() => setBookmarks(bookmarks));
                yield put(actions.allBookmarkedReturned(bookmarks));
            }
            return;
        }

       var existing = _.findIndex(bookmarks, (item)=> item.Id === action.payload.Id);
       if (existing >= 0){
            bookmarks.splice(existing, 1);
            yield call(()=>setBookmarks(bookmarks));
       }
       yield put(actions.removeBookmarkFinished());
       yield put(actions.allBookmarkedReturned(bookmarks));

    } catch (e) {
      yield* requestErrorHandling(e, null, action.payload);
    }
 }

 function* getBookmarked(action) {
    try {
       const bookmarks = (yield call(() => getBookmarks())) || [];
       yield put(actions.allBookmarkedReturned(bookmarks));

    } catch (e) {
      yield* requestErrorHandling(e, null, action.payload);
    }
 }
 function* getVersion(action) {
    try {
       const version = (yield call(() => appStore.getData(versionKey))) || "UNKNOWN";
       yield put(actions.getVersionSucceeded(version));

    } catch (e) {
      yield* requestErrorHandling(e, null, action.payload);
    }
 }


 function* searchPcs(action) {
     try {
        const pcs = yield call(api.searchPackage, action.payload);
        if (pcs)
          yield put(actions.searchPcsSucceeded({searchResult: pcs}));
     } catch (e) {
        yield put(actions.searchPcsFailed({searchErrorMessage: e.message}));
        yield* requestErrorHandling(e, null, action.payload);
   }
  }


 function* setVersion(action) {
    try {
       yield call(() => appStore.setData(versionKey, action.payload));
       yield put(actions.getVersionSucceeded(action.payload));

    } catch (e) {
      yield* requestErrorHandling(e, null, action.payload);
  }
 }
 function* commitBookmarked(action) {
    try {
       const bookmarks = (yield call(() => getBookmarks())) || [];
       var changes = false;
       var toRemove = [];
       bookmarks.forEach(function(bookmark) {

        if (bookmark.removed){
            changes = true;
            toRemove.push(bookmark);
           }
       }, this);

       toRemove.forEach(function(bookmark) {
           var row = _.findIndex(bookmarks, (item)=> item.Id === bookmark.Id);
           if (row=>0){
               bookmarks.splice(row, 1);
        }
        }, this);


       if (changes === true){
        yield call(() => setBookmarks(bookmarks));
        //yield call(()=>appStore.set(bookmarkKey + '_' + config.userName,bookmarks));
        yield put(actions.allBookmarkedReturned(bookmarks));
       }

    } catch (e) {
      yield* requestErrorHandling(e, null, action.payload);
  }
 }

 export function* bookmarks() {

    const addBookmarkRequested = yield all([
        takeLatest(`${actions.addBookmark}`, addBookmark),
        takeLatest(`${actions.removeBookmark}`, removeBookmark),
        takeLatest(`${actions.allBookmarkedRequested}`, getBookmarked),
        takeLatest(`${actions.commitBookmarks}`, commitBookmarked),
    ]);
    //yield call(searchPcs, searchRequested);
   // yield takeLatest(actions.searchPcsSucceededTopic, searchPcs);
  }


  function* getPlant(action){
    try {
        const storedPlant = yield call(() => appStore.getData(plantKey + '_' + config.userName));
        //yield delay(2000);

        if (!storedPlant || !storedPlant.Id){
            yield put(actions.plantNotSet());
        }
        else  {
            yield put(actions.plantReturned(storedPlant));
        }
    } catch (e) {
      yield* requestErrorHandling(e, null, action.payload);
     }

  }

  function* getPlantsFromApi(action){
    try {
        const plants = yield call(() => api.getPlants());
        if (plants)
          yield put(actions.allPlantsReturned(plants));

    } catch (e) {
      yield* requestErrorHandling(e, null, action.payload);
    }
  }

  function* getPermissions(action){
    try {
        const res = yield call(() => api.getPermissions());
        if (res)
          yield put(actions.permissions({permissions: res}));

    } catch (e) {
      yield* requestErrorHandling(e, actions.permissionsFailed, action.payload);
    }
  }


  function* savePlant(action){
    try{
      yield call(() => appStore.setData(plantKey + '_' + config.userName, action.payload));
      yield put(actions.plantReturned(action.payload));
    }
    catch (e) {
      yield* requestErrorHandling(e, null, action.payload);
    }
}

function* postFeedback(action){
  try{
    yield call(() => api.postFeedback(action.payload.message));
  }
  catch (e) {
    yield* requestErrorHandling(e, null, action.payload);
  }
}

function* getPackage(action){
    try{
        var res = yield call(() => api.getPackage(action.payload));
        if (res)
        {
          config.currentPackage = res;
          yield put(actions.loadPcsSucceeded(res));
        }
    }
    catch (e) {
      yield* requestErrorHandling(e, actions.loadPcsFailed, action.payload);
    }
}

function* getScope(action){
    try{
        var res = yield call(() => api.getScope(action.payload));
        if (res) {
          res.localId = randomString(36);
          yield put(actions.setScope(res));
      }
    }
    catch (e) {
      yield* requestErrorHandling(e, actions.scopeFailed, action.payload);
  }
}

function* getPunch(action){
    try{
        var res = yield call(() => api.getPunch(action.payload));
        if (res){
          res.localId = randomString(36);
          yield put(actions.setPunch(res));
      }
    }
    catch (e) {
        yield* requestErrorHandling(e, actions.punchFailed, action.payload);
  }
}

function* getTask(action){
    try{
        var res = yield call(() => api.getTask(action.payload));
        if (res){
          res.localId = randomString(36);
          yield put(actions.setTask(res));
        }
    }
    catch (e) {
      yield* requestErrorHandling(e, actions.taskFailed, action.payload);
    }
}

// Api calls use plant for everything. register plant on api when it is fetched or set
function* keepPlantForApiCalls(action){

    api.setPlant(action.payload);
    config.plant = action.payload || {Id:'notSet'};
    const bookmarks = (yield call(() => getBookmarks())) || [];
    let projects = [];
    try {
        yield put(actions.projectsRequested());
        projects = (yield call(() => api.getProjects(action.payload)));
    }
    catch (e){
      yield* requestErrorHandling(e, actions.projectsFailed, action.payload);
    }

    const storedProject = yield call(() => getProject());

     let proj = null;

     if (storedProject){
       proj = (_.find(projects, i => i.Id === storedProject.Id));
     }

     if (projects.length === 1){
       proj = projects[0];
     }

     if (proj){
       saveProject(proj);
     }
     else{
       saveProject(null);
     }

     api.setProject(proj ? proj.Id : null);


    yield put(actions.permissionsRequested());
    yield put(actions.projectsReturned({projects:projects}));
    yield put(actions.projectSet({project:proj}));
    yield put(actions.allBookmarkedReturned(bookmarks));



}

function isObject(val) {
    if (val === null) { return false;}
    return ( (typeof val === 'function') || (typeof val === 'object') );
}
function errorMessage(error){
    let msg = error.message || error;
    if (isObject(msg)){
        return JSON.stringify(msg);
    }
    return msg;
}
function* error(action){

  try{

    //  AppInsights.trackException(exception: action.payload);

      yield call(() => api.postError(action.payload));

      track(metricKeys.ERROR, isObject(action.payload) ? JSON.stringify(action.payload) : action.payload);



    // Toast or similar?
  }
  catch (e) {
    console.log(e);
  }
}


function* checklistItemRequestChange(action){
  try{
    //  var res = yield call(() => api.getPunch(action.payload));
    var info = action.payload.info;
    action.payload.hash = randomString(10);
    if (info.type === "metaTableChanged"){
      var msg ={
        "CheckListId": info.checkListId,
         "CheckItemId": info.checkListItemId,
         "RowId": info.metaRowId,
         "ColumnId": info.metaColumnId,
         "Value": info.metaValue
       };
        var res = yield call(() => api.metaTableChange(msg));
    }

  else if (info.type === "checkedChange"){
      var msg ={
        "CheckListId": info.checkListId,
         "CheckItemId": info.checkListItemId,
         "Ok": action.payload.checkListItem.IsOk,
         "NotApplicable": action.payload.checkListItem.IsNotApplicable
       };

       if (action.payload.checkListItem.IsOk){
         yield call(() => api.setOkChecklistItem(msg));
       }
       else if (action.payload.checkListItem.IsNotApplicable){
         yield call(() => api.setNaChecklistItem(msg));
       }
       else {
         yield call(() => api.setClearChecklistItem(msg));
       }


    }
      yield put(actions.checklistItemChanged(action.payload));
    }
  catch (e) {
    yield put(actions.checklistItemChangedFailed(action.payload));
    yield* requestErrorHandling(e, null, action.payload);
  }
}

function* checklistSignRequest(action){
  try{
      //  var res = yield call(() => api.getPunch(action.payload));
      action.payload.hash = randomString(10);

      yield call(() => api.signChecklist({ "CheckListId": action.payload.Id}));

      var res = yield call(() => api.getScope(action.payload));
      if (res){
        res.localId = randomString(36);
        yield put(actions.setScope(res));
      }

      if (config.currentPackage) {yield put(actions.loadPcs(config.currentPackage)); }//refresh package
//      yield put(actions.checklistChanged(action.payload));
  }
  catch (e) {

    if (e.status == 400){
      action.payload.signUnsignFailure = e.response._bodyText;
    }
    else if (e.status == 403){
      action.payload.signUnsignFailure = "You don't have access to do this";
    }
    yield* requestErrorHandling(e, actions.checklistChangedFailed, action.payload);

  }
}

function* checklistUnsignRequest(action){
  try{
    //  var res = yield call(() => api.getPunch(action.payload));
      action.payload.hash = randomString(10);
      var res = yield call(() => api.unSignChecklist({ "CheckListId": action.payload.Id}));
      action.payload.SignedAt = null;
      if (config.currentPackage) {yield put(actions.loadPcs(config.currentPackage)); }//refresh package
      yield put(actions.checklistChanged(action.payload));
  }
  catch (e) {
    if (e.status == 400){
      action.payload.signUnsignFailure = e.response._bodyText;
    }
    else if (e.status == 403){
      action.payload.signUnsignFailure = "You don't have access to do this";
    }

   yield* requestErrorHandling(e, actions.checklistChangedFailed, action.payload);

  }
}

function* checklistCommentRequest(action){
  try{
      action.payload.hash = randomString(10);
      var res = yield call(() => api.commentChecklist({ "CheckListId": action.payload.Id, "Comment": action.payload.Comment}));
  }
  catch (e) {
    yield* requestErrorHandling(e, actions.checklistChangedFailed, action.payload);
  }
}



function* taskSignRequest(action){
  try{
      //  var res = yield call(() => api.getPunch(action.payload));
      action.payload.hash = randomString(10);

      var res = yield call(() => api.signTask({ "taskId": action.payload.Id}));
      action.payload.SignedAt = new Date();

      var res = yield call(() => api.getTask(action.payload));
      if (res){
        res.localId = randomString(36);
        yield put(actions.setTask(res));
      }
      if (config.currentPackage) {yield put(actions.loadPcs(config.currentPackage)); }//refresh package
      yield put(actions.taskChanged(action.payload));
  }
  catch (e) {

    if (e.status == 400){
      action.payload.signUnsignFailure = e.response._bodyText;

    }
    else if (e.status == 403){
      action.payload.signUnsignFailure = "You don't have access to do this";

    }
    yield* requestErrorHandling(e, actions.taskChangedFailed, action.payload);
}
}

function* taskParameterRequest(action){
  try{
      //  var res = yield call(() => api.getPunch(action.payload));
      action.payload.hash = randomString(10);

      var res = yield call(() => api.changeParameterOnTask({ParameterId: action.payload.Id, Value: action.payload.MeasuredValue} ));
      action.payload.SignedAt  = new Date();
      if (config.currentPackage) {yield put(actions.loadPcs(config.currentPackage)); }//refresh package
      yield put(actions.taskChanged(action.payload));
  }
  catch (e) {

    if (e.status == 400){
      action.payload.parameterFailure = e.response._bodyText;
    }
    else if (e.status == 403){
      action.payload.parameterFailure = "You don't have access to do this";
    }

    yield* requestErrorHandling(e, actions.taskChangedFailed, action.payload);


  }
}


function* taskUnsignRequest(action){
  try{
    //  var res = yield call(() => api.getPunch(action.payload));
      action.payload.hash = randomString(10);
      var res = yield call(() => api.unSignTask({ "taskId": action.payload.Id}));
      action.payload.SignedAt = null;

      var res = yield call(() => api.getTask(action.payload));
      if (res){
        res.localId = randomString(36);
        yield put(actions.setTask(res));
      }
      if (config.currentPackage) {yield put(actions.loadPcs(config.currentPackage)); }//refresh package
      yield put(actions.taskChanged(action.payload));
  }
  catch (e) {
    if (e.status == 400){
      action.payload.signUnsignFailure = e.response._bodyText;
    }
    else if (e.status == 403){
      action.payload.signUnsignFailure = "You don't have access to do this";
    }

    yield* requestErrorHandling(e, actions.taskChangedFailed, action.payload);

  }
}

function* taskCommentRequest(action){
  try{
      action.payload.hash = randomString(10);
      var res = yield call(() => api.commentTask({ "TaskId": action.payload.Id, "CommentAsHtml": action.payload.CommentAsHtml}));
  }
  catch (e) {
    yield* requestErrorHandling(e, actions.taskChangedFailed, action.payload);
  }
}


function* attachmentsRequest(action){
  try{
      action.payload.hash = randomString(10);
      let info = action.payload;
      let req = {thumbnailSize: info.thumbnailSize};
      let res = null;
      req.checkListId = info.id;
      res = yield call(() => api.getScopeAttachments(req));
      if (res){
        yield put(actions.attachmentsResponse({thumbnails:res}));
      } else {
        console.error('Failed to get attachments');
      }

    //  yield put(actions.checklistChanged(action.payload));
  }
  catch (e) {
    yield* requestErrorHandling(e, null, action.payload);
  }
}


function* attachmentsRequestPunch(action){
  try{
      action.payload.hash = randomString(10);
      let info = action.payload;

      let req = {thumbnailSize: info.thumbnailSize};
      let res = null;
        req.punchId = info.id;
        res = yield call(() => api.getPunchAttachments(req));
        if (res){
          yield put(actions.attachmentsResponsePunch({thumbnails:res}));
        }


    //  yield put(actions.checklistChanged(action.payload));
  }
  catch (e) {
    console.error('Failed to fetch Punch Attachments: ', e);
    yield* requestErrorHandling(e, null, action.payload);
  }
}


function* taskAttachmentRequest(action){
  try{
      action.payload.hash = randomString(10);
      let info = action.payload;
      if (info.uri){
        yield delay(200);
        yield put(actions.taskAttachmentResponse({filePath:null,  base64: null, uri: info.uri, title:info.title, extension: mime.extension(info.mimeType) || getExtension(info.uri),index:info.index}));
      }
      else {
        let res = null;
        res = yield call(() => api.getTaskAttachment(info));
        if (res){
          yield put(actions.taskAttachmentResponse({hasFile:info.hasFile, filePath:`data:{${info.mimeType};base64,${res}`, base64:res, uri: info.uri, title:info.title, extension: mime.extension(info.mimeType),index:info.index}));
        }
      }

  //  yield put(actions.checklistChanged(action.payload));
  }
  catch (e) {
    yield* requestErrorHandling(e, null, action.payload);
}
}


function* attachmentRequest(action){
  try{
      action.payload.hash = randomString(10);
      let info = action.payload;
      if (info.uri){
        yield delay(200);
        yield put(actions.attachmentResponse({filePath:null,  base64: null, uri: info.uri, title:info.title, extension: mime.extension(info.mimeType) || getExtension(info.uri),index:info.index}));
      }
      else {

        let res = null;
        res = yield call(() => api.getScopeAttachment(info));
        if (res){
          yield put(actions.attachmentResponse({filePath:`data:{${info.mimeType};base64,${res}`, base64:res, uri: info.uri, title:info.title, extension: mime.extension(info.mimeType),index:info.index}));
        }
      }
  //  yield put(actions.checklistChanged(action.payload));
  }
  catch (e) {
    yield* requestErrorHandling(e, null, action.payload);
  }
}


function* attachmentRequestPunch(action){
  try{
      action.payload.hash = randomString(10);
      let info = action.payload;
      if (info.uri){
        yield delay(200);
        yield put(actions.attachmentResponsePunch({filePath:null,  base64: null, uri: info.uri, title:info.title, extension: mime.extension(info.mimeType) || getExtension(info.uri),index:info.index}));
      }
      else {
        let res = yield call(() => api.getPunchAttachment(info));
        if (res)  {
          yield put(actions.attachmentResponsePunch({filePath:`data:{${info.mimeType};base64,${res}`, base64:res, uri: info.uri, title:info.title, extension: mime.extension(info.mimeType),index:info.index}));
      }
    }
  }
  catch (e) {
    yield* requestErrorHandling(e, null, action.payload);
}
}


function* saveAttachmentRequest(action){
  try{
      let info = action.payload;
      var res = yield call(() => api.saveScopeAttachment(action.payload));
      yield put(actions.attachmentSaveOkResponse(action.payload));
  }
  catch (e) {
    yield* requestErrorHandling(e, actions.attachmentSaveFailedResponse, action.payload);
  }
}


function* saveAttachmentRequestPunch(action){
  try{
    let info = action.payload;
      var res = yield call(() => api.savePunchAttachment(action.payload));
      yield put(actions.attachmentSaveOkResponsePunch(action.payload));
  }
  catch (e) {
    yield* requestErrorHandling(e, actions.attachmentSaveFailedResponsePunch, action.payload);

  }
}

function* deleteAttachmentRequest(action){
  try{
    let info = action.payload;
    //  action.payload.hash = randomString(10);
      var res = yield call(() => api.deleteScopeAttachment(action.payload));
      yield put(actions.attachmentDeleteOkResponse(action.payload));
  }
  catch (e) {
    yield* requestErrorHandling(e, actions.attachmentDeleteFailedResponse, action.payload);
  }
}


function* deleteAttachmentRequestPunch(action){
  try{
    let info = action.payload;

    var res = yield call(() => api.deletePunchAttachment(action.payload));
    yield put(actions.attachmentDeleteOkResponsePunch(action.payload));

  }
  catch (e) {
    yield* requestErrorHandling(e, actions.attachmentDeleteFailedResponsePunch, action.payload);
}
}

function* requestErrorHandling(failedRequest, actionToFire, payload) {
try {
  if (failedRequest.status == 400){
    payload.message = failedRequest.response._bodyText;
    if (actionToFire) { yield put(actionToFire(payload));}

  }
  else if (failedRequest.status == 401){
    NavigationService.reset('LoginRoute');
  }

  else if (failedRequest.status == 403){
    payload.message = failedRequest.response._bodyText || "You don't have access to do this";
    if (actionToFire) { yield put(actionToFire(payload));}

  }
  else{
    if (actionToFire) { yield put(actionToFire(failedRequest));}
    yield put(actions.generalError(failedRequest));
  }
}
  catch(e){
    console.log(e);
  }
}

function* saveNewPunch(action){
  try{
    var res = yield call(() => api.saveNewPunch(action.payload));
    if (res){
      yield put(actions.punchRequest(res));
      yield put(actions.scopeRequest({Id:action.payload.CheckListId}));
      //  getScope(action)
      yield put(actions.loadPcs(config.currentPackage));
    }

  }
  catch (e) {
    yield* requestErrorHandling(e, actions.punchChangedFailed, action.payload);
  }
}

function* clearPunch(action){
  try{
    var res = yield call(() => api.clearPunch(action.payload));
    yield put(actions.loadPcs(config.currentPackage));
    yield put(actions.punchRequest(action.payload));

  }
  catch (e) {
    yield* requestErrorHandling(e, actions.punchChangedFailed, action.payload);
  }
}
function* unClearPunch(action){
  try{
    var res = yield call(() => api.unClearPunch(action.payload));
    yield put(actions.loadPcs(config.currentPackage));
    yield put(actions.punchRequest(action.payload));
  }
  catch (e) {
    yield* requestErrorHandling(e, actions.punchChangedFailed, action.payload);
  }
}


function* rejectPunch(action){
  try{
    var res = yield call(() => api.rejectPunch(action.payload));
    yield put(actions.loadPcs(config.currentPackage));
    yield put(actions.punchRequest(action.payload));

  }
  catch (e) {
    yield* requestErrorHandling(e, actions.punchChangedFailed, action.payload);
  }
}

function* verifyPunch(action){
  try{
    var res = yield call(() => api.verifyPunch(action.payload));
    yield put(actions.loadPcs(config.currentPackage));
    yield put(actions.punchIsVerified(action.payload));
    //TODO go back and remove from list

  }
  catch (e) {
    yield* requestErrorHandling(e, actions.punchChangedFailed, action.payload);
  }
}

function* updatePunch(action){
  try{
    var data =action.payload;
    var type = data.field;

    switch(type){
      case 'Description':
        yield call(() => api.updatePunchDescription({PunchItemId: data.Id, Description:data.data }));
        yield put(actions.loadPcs(config.currentPackage));

        break;
      case 'Category':
        yield call(() => api.updatePunchCategory({PunchItemId: data.Id, CategoryId:data.data }));
        yield put(actions.loadPcs(config.currentPackage));
        break;
      case 'Type':
        yield call(() => api.updatePunchType({PunchItemId: data.Id, TypeId:data.data }));
        break;
      case 'RaisedBy':
        yield call(() => api.updatePunchRaisedBy({PunchItemId: data.Id, RaisedByOrganizationId:data.data }));
        break;
      case 'ClearingBy':
        yield call(() => api.updatePunchClearingBy({PunchItemId: data.Id, ClearingByOrganizationId:data.data }));
        break;


    }
    yield put(actions.punchChanged({...data}));

  }
  catch (e) {
    yield* requestErrorHandling(e, actions.punchChangedFailed, action.payload);
  }
}


function* saveNewPunchTmpAttachment(action){
  try{
    let info = action.payload;
    var res = yield call(() => api.saveNewPunchTmpAttachment(action.payload));
    if (res){
      yield put(actions.newPunchTmpAttachmentSaveResponse({Id:res.Id,MimeType:"image/jpeg", Extension:action.payload.file.extension, ThumbnailAsBase64:action.payload.file.data, Title:action.payload.file.title}));
    }

  }
  catch (e) {
    yield* requestErrorHandling(e, actions.punchChangedFailed, action.payload);
  }
}



function* getPunchMetadata(action){
  try{

    var res = yield call(() => api.getPunchMetadata(action.payload));
    if (res){
      yield put(actions.punchMetadataResponse(res));
    }

  }
  catch (e) {
      yield* requestErrorHandling(e, actions.punchMetadataRequestFailed, action.payload);
  }
}


function* getProjects(action){
  try{

    yield put(actions.projectsRequested());
    var res = yield call(() => api.getProjects(action.payload));
    if (res){
      yield put(actions.projectsReturned(res));
    }

  }
  catch (e) {
      yield* requestErrorHandling(e, null, action.payload);
  }
}

function* setProject(action){
  try{
      yield call(() => saveProject(action.payload));
      api.setProject(action.payload ? action.payload.Id : null);
      yield put(actions.projectSet({project:action.payload}));
  }
  catch (e) {
      yield* requestErrorHandling(e, null, action.payload);
  }
}

function* setStorageUsername(action) {
  StorageService.setPrefix(action.payload && action.payload.oid || null);
}

export function* appWatcher() {

    yield all([
    takeLatest(`${actions.plantRequest}`, getPlant),
    takeLatest(`${actions.allPlantsRequested}`, getPlantsFromApi),

    takeLatest(`${actions.postFeedback}`, postFeedback),
    takeLatest(`${actions.generalError}`, error),
    takeLatest(`${actions.searchPcsRequested}`, searchPcs),
    takeLatest(`${actions.loadPcs}`, getPackage),
    takeLatest(`${actions.plantReturned}`, keepPlantForApiCalls),
    takeLatest(`${actions.plantSet}`, savePlant),
    takeLatest(`${actions.getVersionRequested}`, getVersion),
    takeLatest(`${actions.setVersion}`, setVersion),

    takeLatest(`${actions.scopeRequest}`, getScope),
    takeLatest([`${actions.punchRequest}`, `${actions.punchChanged}`], getPunch),

    takeLatest(`${actions.taskRequest}`, getTask),
    takeLatest(`${actions.taskSignRequest}`, taskSignRequest),
    takeLatest(`${actions.taskUnsignRequest}`, taskUnsignRequest),
    takeLatest(`${actions.taskCommentRequest}`, taskCommentRequest),
    takeLatest(`${actions.taskParameterRequest}`, taskParameterRequest),

    takeLatest(`${actions.checklistItemChangeRequest}`, checklistItemRequestChange),
    takeLatest(`${actions.checklistSignRequest}`, checklistSignRequest),
    takeLatest(`${actions.checklistUnsignRequest}`, checklistUnsignRequest),
    takeLatest(`${actions.checklistCommentRequest}`, checklistCommentRequest),


    takeLatest(`${actions.attachmentsRequest}`, attachmentsRequest),
    takeLatest(`${actions.attachmentRequest}`, attachmentRequest),
    takeLatest(`${actions.attachmentSaveRequest}`, saveAttachmentRequest),
    takeLatest(`${actions.attachmentDeleteRequest}`, deleteAttachmentRequest),


    takeLatest(`${actions.attachmentsRequestPunch}`, attachmentsRequestPunch),
    takeLatest(`${actions.attachmentRequestPunch}`, attachmentRequestPunch),
    takeLatest(`${actions.attachmentSaveRequestPunch}`, saveAttachmentRequestPunch),
    takeLatest(`${actions.attachmentDeleteRequestPunch}`, deleteAttachmentRequestPunch),

    takeLatest(`${actions.taskAttachmentRequest}`, taskAttachmentRequest),

    takeLatest(`${actions.newPunchCreateRequest}`, saveNewPunch),
    takeLatest(`${actions.newPunchTmpAttachmentSaveRequest}`, saveNewPunchTmpAttachment),
    takeLatest(`${actions.punchMetadataRequest}`, getPunchMetadata),

    takeLatest(`${actions.punchClearRequest}`, clearPunch),
    takeLatest(`${actions.punchUnClearRequest}`, unClearPunch),
    takeLatest(`${actions.punchRejectRequest}`, rejectPunch),
    takeLatest(`${actions.punchVerifyRequest}`, verifyPunch),
    takeLatest(`${actions.punchUpdateRequest}`, updatePunch),


    takeLatest(`${actions.projectsRequest}`, getProjects),
    takeLatest(`${actions.permissionsRequested}`, getPermissions),
    takeLatest(`${actions.projectNewSet}`, setProject),
    takeLatest(`${actions.USER_UPDATED}`, setStorageUsername),

    ]);
}

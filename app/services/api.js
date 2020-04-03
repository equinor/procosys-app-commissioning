import {
  ApiBaseUrl,
  ApiVersion,
  AzureADClientId,
  ApiResourceIdentifier,
  BuildConfiguration
} from '../settings';

import { ReactNativeAD } from 'react-native-azure-ad';
import {Alert} from 'react-native';

import {NetworkException} from '../utils/Exception';
import RNFetchBlob from 'rn-fetch-blob';
const jsonHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};
const createUrl = (path, params, noVersion, noPlant) => `${ApiBaseUrl}${path}${buildQueryString(params, noVersion, noPlant)}`;
const createAbsoluteUrl = (path, params) => `${path}${buildQueryString(params,true,true)}`;

const userManager = () => ({
  getIdToken: () => ReactNativeAD.getContext(AzureADClientId).assureToken(ApiResourceIdentifier)
});

const globalConfig = {'plant': null, 'user':{}};

export function setPlant (plant) {

    globalConfig.plant = plant;

}
export function setProject (project) {

    globalConfig.project = project;

}

export function setUser (userInfo) {

    globalConfig.user = userInfo;

}


const buildQueryString = (p, noVersion, noPlant) => {
  let res = '';
  let first = true;

  if (p){

    for (var i = 0; i < p.length; i++) {
      if (first){
        res = `?${p[i].key}=${encodeURIComponent(p[i].value)}`;
        first = false;
      }
      else {
        res += `&${p[i].key}=${encodeURIComponent(p[i].value)}`;
      }
    }
  }

  if (!noVersion){
    if (first){
      res = `?${encodeURIComponent('api-version')}=${ApiVersion}`;
      first = false;
    }
    else {
      res += `&${encodeURIComponent('api-version')}=${ApiVersion}`;
    }
  }

  if (!noPlant && globalConfig.plant){
    if (first){
      res = `?plantId=${encodeURIComponent(globalConfig.plant.Id)}`;
      first = false;
    }
    else {
      res += `&plantId=${encodeURIComponent(globalConfig.plant.Id)}`;
    }
  }



  return res;
}

const downloadData = (path, params, absolutePath, returnRaw) => {

  const URI = absolutePath ? path : createUrl(path, params);
  postToLog({'downloadsData': URI}, 'DownloadRequest');

  return userManager().getIdToken().
    then((token) => {
      console.log('Requesting....');
      try {
        return RNFetchBlob.fetch('GET', URI, {'Authorization': `Bearer ${token}`}).
        then((res) => {
          if (returnRaw) {
              return res.text();
          }
            return res.base64();
        }).then((result) => {
          return result;
        })
        .catch((errorMessage, statusCode, res) => {
          Alert.alert('Download failed', errorMessage)
          console.log('Network exception while downloading: ', errorMessage, statusCode, res);
          throw new NetworkException(errorMessage, statusCode, res);

        });
      } catch (err) {
        console.log('RNFetchBlob failed: ', err);
      }
      
    });
      

};


const uploadData = (file, path, params, absolutePath) => {
  postToLog({'uploadsData':absolutePath ? path : createUrl(path, params)}, 'UploadRequest');

  return userManager().getIdToken().
    then((token) =>
      RNFetchBlob.fetch('POST',
        absolutePath ? path : createUrl(path, params),
        {
          'Authorization': `Bearer ${token}`,
          'Content-Type' : 'multipart/form-data'
       },
       [{
         name : file.title,
        filename : file.title + '.jpg',
        type:'image/jpeg',
        data: file.data || RNFetchBlob.wrap(file.path)
      }]).
        then((res) => {
          //if (res.respInfo && res.respInfo.status)
          return res.data ? res.json() :  "ok";
        }).
        catch((errorMessage, statusCode, res) => {
          console.error('UploadRequest: File upload failed: ', errorMessage);
          throw new NetworkException(errorMessage, statusCode, res);

        }));

};


const fetchData = (path, params, absolutePath) => {

  const URI = absolutePath ? path : createUrl(path, params);


  postToLog({'get': URI}, 'GetRequest');
  return userManager().getIdToken().
    then((token) =>
      token ? fetch(URI, {
          'method': 'GET',
          'withCredentials': true,
          'headers': {
            ...jsonHeaders,
            'Authorization': `Bearer ${token}`
          }
        }).
          then((response) => {

            if (response.ok) {

              return (response._bodyText || (response._bodyBlob && response._bodyBlob.size > 0)) ? response.json() : 'ok';

            }
            response.text().then(result => {
              Alert.alert('Error', result);
            });

          }).then(result => {
            return result;
          }) : Promise.resolve(null));

};

const postData = (path, params, data, absolutePath, dontLog) => {

  if (!dontLog) {
    postToLog({'post':{data : data, path: (absolutePath ? path : createUrl(path, params))}}, 'PostRequest');
  }

  return userManager().getIdToken().
    then((token) => token ? fetch(absolutePath ? path : createUrl(path, params), {
      'method': 'POST',
      'withCredentials': true,
      'headers': {
        ...jsonHeaders,
        'Authorization': `Bearer ${token}`
      },
      'body': JSON.stringify(data)
    }).
    then((response) => {

      if (response.ok) {

        return (response._bodyText || (response._bodyBlob && response._bodyBlob.size > 0)) ? response.json() : 'ok';

      }
      response.text().then(result => {
        Alert.alert('Error', result);
      });
      //console.error(response.statusText, response.status);
      //throw new NetworkException(response.statusText, response.status, response);

    }).then(response => {
      console.log('Response Body: ', response);
      return response;
    }) : Promise.resolve(null));

};

const postDataNoAuth = (path, params, data, absolutePath) => {
  return fetch(absolutePath ? createAbsoluteUrl(path, params) : createUrl(path, params, true, true), {
      'method': 'POST',
      'headers': {
        ...jsonHeaders
      },
      'body': JSON.stringify(data)
    }).
    then((response) => {

      if (response.ok) {

        return (response._bodyText || (response._bodyBlob && response._bodyBlob.size > 0)) ? response.json() : 'ok';

      }
      throw new NetworkException(response.statusText, response.status, response);

    });

};



const putData = (path, params, data, absolutePath) => {
  var RequestURI = absolutePath ? path : createUrl(path, params);
  console.log('PutRequest - ' + RequestURI);
  postToLog({'put':{data : data, path: RequestURI}}, 'PutRequest');

  return userManager().getIdToken().
    then((token) => token ? fetch(RequestURI, {
      'method': 'PUT',
      'withCredentials': true,
      'headers': {
        ...jsonHeaders,
        'Authorization': `Bearer ${token}`
      },
      'body': JSON.stringify(data)
    }).
    then((response) => {
      console.log('Put response: ', response);

      if (response.ok) {

        return (response._bodyText || (response._bodyBlob && response._bodyBlob.size > 0)) ? response.json() : 'ok';

      }
      console.error('Network request failed: ', response);
      response.text().then(e => console.error('Error message: ', e)).catch(e => console.error('Failed to catch error messsage: ', e));

      throw new NetworkException(`${response.statusText} - ${response._bodyText}`, response.status, response);

    }): Promise.resolve(null));


};


const deleteData = (path, params, data, absolutePath) => {

  postToLog({'delete':{data : data, path: (absolutePath ? path : createUrl(path, params))}}, 'DeleteRequest');
  return userManager().getIdToken().
    then((token) => token ? fetch(absolutePath ? path : createUrl(path, params), {
      'method': 'DELETE',
      'withCredentials': true,
      'headers': {
        ...jsonHeaders,
        'Authorization': `Bearer ${token}`
      },
      'body': JSON.stringify(data)
    }).
    then((response) => {

      if (response.ok) {

        return (response._bodyText || (response._bodyBlob && response._bodyBlob.size > 0)) ? response.json() : 'ok';

      }
      throw new NetworkException(`${response.statusText} - ${response._bodyText}`, response.status, response);

    }) : Promise.resolve(null));

};

const mock = (path, params, data) => {

  console.log(`mock call to ${path}`);
  return Promise.resolve(data);

};

export const getPlants = () => fetchData('plants');

/*
 * Mock search
 * export const searchPackage = (params) => mock(createUrl("searchCommPackages"),{
 * total: 42,
 *   result:[
 *   {id:1,no:'10-11', description:"NOV L7630 - BOP Hydraulic Chain Hoists",mcStatus:'OS',commPkgStatus:'PB', stateRfcc:'OS', stateRfoc:'OS'},
 *   {id:1,no:'10-12', description:"Package 2",mcStatus:'OK',commPkgStatus:'PB', stateRfcc:'OS', stateRfoc:'OS'},
 *   {id:1,no:'10-14', description:"Package 3",mcStatus:'OS',commPkgStatus:'PB', stateRfcc:'OS', stateRfoc:'OS'},
 * ].filter((item)=>{
 *   return item.no.indexOf(params.query)>=0;
 * })})
 */

export const searchPackage = (params) => {

  if (!globalConfig.plant || !globalConfig.plant.Id) {

    throw {'message': 'Plant is not set. Go to settings and choose "Change plant"'};

  }
  return fetchData(`CommPkg/Search`,[{key:'startsWithCommPkgNo',value:params.query},{key:'projectId',value:globalConfig.project || null}]);

};

export const getPermissions = () => fetchData(`Permissions`);

export const getProjects = () => fetchData(`Projects`);

export const getScope = (params) => fetchData(`CheckList/Comm`, [{key:'checkListId',value:params.Id}]);

export const getPunch = (params) => {
  return fetchData(`PunchListItem`, [{key:'punchItemId',value:params.Id}]);
}

export const getTask = (params) => {
  return userManager().getIdToken().
     then(() => {
  const task = fetchData(`CommPkg/Task`, [{key:'taskId',value:params.Id}]);
  const taskParams = fetchData(`CommPkg/Task/Parameters`, [{key:'taskId',value:params.Id}]);
  const taskAttachments = fetchData(`CommPkg/Task/Attachments`, [{key:'taskId',value:params.Id},{key:'thumbnailSize', value:params.thumbnailSize || 64}]);
  return Promise.all([
    task,
    taskParams,
    taskAttachments
  ]).then((values) => ({

    ...values[0],
    'parameters': values[1],
    'thumbnails': values[2]
  }));
});

};
export const getTaskAttachment = (params) => downloadData(`CommPkg/Task/Attachment`, [{key:'taskId',value:params.taskId},{key:'attachmentId', value:params.attachmentId}]);

export const getScopeAttachments = (params) => fetchData(`CheckList/Attachments`, [{key:'checkListId',value:params.checkListId},{key:'thumbnailSize', value:params.thumbnailSize || 64}]);

export const getScopeAttachment = (params) => downloadData(`CheckList/Attachment`, [{key:'checkListId',value:params.checkListId},{key:'attachmentId', value:params.attachmentId}]);

export const saveScopeAttachment = (params) => uploadData(params.file,`CheckList/Attachment`, [{key:'checkListId',value:params.checkListId}]);

export const deleteScopeAttachment = (params) => deleteData(`CheckList/Attachment`, [], params);

export const getPunchAttachments = (params) => fetchData(`PunchListItem/Attachments`, [{key:'punchItemId',value:params.punchId},{key:'thumbnailSize', value: params.thumbnailSize || 64 }]);

export const getPunchAttachment = (params) => downloadData(`PunchListItem/Attachment`, [{key:'punchItemId',value:params.punchId},{key:'attachmentId', value:params.attachmentId}]);

export const savePunchAttachment = (params) => uploadData(params.file,`PunchListItem/Attachment`, [{key:'punchItemId',value:params.punchItemId}]);
export const deletePunchAttachment = (params) => deleteData(`PunchListItem/Attachment`, [], params);


export const saveNewPunch = (message) => postData(`PunchListItem`, [], message);
export const saveNewPunchTmpAttachment = (message) => uploadData(message.file, `PunchListItem/TempAttachment`, []);
export const clearPunch = (message) => postData(`PunchListItem/Clear`, [], message.Id);
export const unClearPunch = (message) => postData(`PunchListItem/UnClear`, [], message.Id);
export const rejectPunch = (message) => postData(`PunchListItem/Reject`, [], message.Id);
export const verifyPunch = (message) => postData(`PunchListItem/Verify`, [], message.Id);

export const updatePunchDescription = (message) => putData(`PunchListItem/SetDescription`, [], message);
export const updatePunchCategory = (message) => putData(`PunchListItem/SetCategory`, [], message);
export const updatePunchType = (message) => putData(`PunchListItem/SetType`, [], message);
export const updatePunchRaisedBy = (message) => putData(`PunchListItem/SetRaisedBy`, [], message);
export const updatePunchClearingBy = (message) => putData(`PunchListItem/SetClearingBy`, [], message);

export const getPunchMetadata = (params) => {
  return userManager().getIdToken().
     then(() => {
  const types = fetchData(`PunchListItem/Types`, [{key:'commPkgId', value:params.Id}]);
  const categories = fetchData(`PunchListItem/Categories`, [{key:'commPkgId', value:params.Id}]);
  const orgs = fetchData(`PunchListItem/Organizations`, [{key:'commPkgId', value:params.Id}]);
  return Promise.all([
    types,
    categories,
    orgs
  ]).then((values) => ({

    'types': values[0],
    'categories': values[1],
    'organizations': values[2]

  }));});

};



export const getPackage = (params) => {
  return userManager().getIdToken().
     then(() => {
  const main = fetchData(`CommPkg`, [{key:'commPkgId', value:params.Id}]);
  const scope = fetchData(`CommPkg/CheckLists`, [{key:'commPkgId', value:params.Id}]);
  const punchList = fetchData(`CommPkg/PunchList`, [{key:'commPkgId', value:params.Id}]);
  const taskList = fetchData(`CommPkg/Tasks`, [{key:'commPkgId', value:params.Id}]);
  return Promise.all([
    main,
    scope,
    punchList,
    taskList
  ]).then((values) => ({

    ...values[0],
    'scopes': values[1],
    'punches': values[2],
    'tasks': values[3]

  }));});

};


export const postFeedback = (message) => postData(`Feedback?message=${message}`,null, {});

export const setOkChecklistItem = (message) => postData(`CheckList/Item/SetOk`, [], message);
export const setClearChecklistItem = (message) => postData(`CheckList/Item/Clear`, [], message);
export const setNaChecklistItem = (message) => postData(`CheckList/Item/SetNA`, [], message);


export const signChecklist = (message) => postData(`CheckList/Sign`, [], message.CheckListId);
export const unSignChecklist = (message) => postData(`CheckList/Unsign`, [], message.CheckListId);
export const commentChecklist = (message) => putData(`CheckList/Comment`, [], message);
export const metaTableChange = (message) => putData(`CheckList/Item/MetaTableCell`, [], message);


export const signTask = (message) => postData(`CommPkg/Task/Sign`, [], message.taskId);
export const unSignTask = (message) => postData(`CommPkg/Task/Unsign`, [], message.taskId);
export const commentTask = (message) => putData(`CommPkg/Task/Comment`, [], message);
export const changeParameterOnTask = (message) => putData(`CommPkg/Task/Parameters/Parameter`, [], message);


// log and trace
export const postFatal = (message) => postToLog(message, 'Fatal');
export const postError = (message) => postToLog(message, 'Error');
export const postInfo = (message) => postToLog(message, 'Info');

export const postToLog = (message, type) => {
  if (BuildConfiguration == 'Dev'){
    if (console.groupCollapsed) {
      console.groupCollapsed("[DEV] - POST TO LOG - " + type + " [DEV]")
    } 
    console.log("Message type: " + type);
    console.log("Message: ", message);
    if (console.groupCollapsed) {
      console.groupEnd("[DEV] - POST TO LOG - " + type + " [DEV]");
    }
  }
}
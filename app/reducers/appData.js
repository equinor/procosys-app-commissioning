// Globally interesting data
import { handleActions } from 'redux-actions';
import * as actions from '../actions';

const defaultState = {
    plant: null,
    plantSet: null
    //dataSet: false
  };

export default handleActions({
  [actions.plantRequest]: (state, action) => ({
    ...state,
   ...action.payload,
 }),
 [actions.plantNotSet]: (state, action) => ({
    ...state,
   ...action.payload,
   plantSet:false
 }),
 [actions.plantReturned]: (state, action) => ({
    ...state,
  plant: action.payload,
   plantSet:true
 }),
 [actions.plantSet]: (state, action) => ({
    ...state,
   ...action.payload,
 }),
 [actions.permissions]: (state, action) =>{
   let p = action.payload.permissions;
   return ({
      ...state,

     permissions: {
       canUseApp:p.includes('PUNCHLISTITEM/READ') && (p.includes('CPCL/READ') || p.includes('RUNNING_LOGS/READ')) && p.includes('PUNCHLISTITEM/READ') && p.includes('DOCUMENT/READ'),

       canReadPunchItem : p.includes('PUNCHLISTITEM/READ'),
       canEditPunchItem : p.includes('PUNCHLISTITEM/WRITE'),
       canCreatePunchItem : p.includes('PUNCHLISTITEM/CREATE'),
       canClearPunchItem : p.includes('PUNCHLISTITEM/CLEAR'),
       canRejectPunchItem : p.includes('PUNCHLISTITEM/VERIFY'),
       canVerifyPunchItem : p.includes('PUNCHLISTITEM/VERIFY'),
       canUnclearPunchItem : p.includes('PUNCHLISTITEM/CLEAR'),

       canSignChecklistItem: (p.includes('CPCL/SIGN') || p.includes('RUNNING_LOGS/SIGN')),
       canEditChecklistItem: (p.includes('CPCL/WRITE') || p.includes('RUNNING_LOGS/WRITE')),
       canAttachChecklistItem: (p.includes('CPCL/ATTACHFILE') || p.includes('RUNNING_LOGS/ATTACHFILE')),

       canUpdateAndSignTask : p.includes('DOCUMENT/WRITE'),
     },

     allPermissions: p,
     permissionsRequested : false
   })
 },
 [actions.permissionsRequested]: (state, action) => ({
    ...state,
   permissionsRequested : true,
   allPermissions:null,
   
   permissionsFailed : false
 }),
 [actions.permissionsFailed]: (state, action) => ({
    ...state,
   permissionsFailed : true
 }),
 [actions.allPlantsReturned]: (state, action) => ({
    ...state,
   ...action.payload,
   requested:false
 }),

 [actions.loadPcs]: (state, action) => ({
  ...state,
 ...action.payload,
 pcsLoading:true
}),
[actions.loadPcsSucceeded]: (state, action) => ({
...state,
pcs: action.payload,
pcsLoading:false
}),
[actions.loadPcsFailed]: (state, action) => ({
...state,
loadError: action.payload,
pcsLoading:false
}),
[actions.allBookmarkedReturned]: (state, action) => ({
  ...state,
  allBookmarked: action.payload.allBookmarked
}),

[actions.setScope]: (state, action) => ({
  ...state,
  scope: action.payload
}),


[actions.setPunch]: (state, action) => ({
  ...state,
  punch: action.payload
}),

[actions.setNewPunch]: (state, action) => ({
  ...state,
  punch:{
    CheckListId: action.payload.Id,
    SystemModule: action.payload.SystemModule,
    TagNo: action.payload.TagNo,
    TagDescription: action.payload.TagDescription
  }
}),

[actions.setTask]: (state, action) => ({
  ...state,
  task: action.payload
}),


[actions.onboarded]: (state, action) => ({
  ...state,
  userOnboarded: true
}),
[actions.onboarding]: (state, action) => ({
  ...state,
  userOnboarding: true
}),

[actions.projectsRequested]: (state, action) => ({
  ...state,
  projectsRequest: true,
  projects: null
}),

[actions.projectsReturned]: (state, action) => ({
  ...state,
  projectsRequest: false,
  projects: [{Id:null, Description:'All projects'},...action.payload.projects]
}),

[actions.projectsFailed]: (state, action) => ({
  ...state,
  projectsRequest: false,
  projects: null
}),

[actions.projectSet]: (state, action) => ({
  ...state,
  project: action.payload.project
})


}, defaultState);


const getAppData = state => state.Main.appData;

export const userIsOnboarded = state => getAppData(state).userOnboarded;
export const userIsOnboarding = state => getAppData(state).userOnboarding;
export const getProjects = state => getAppData(state).projects;
export const getProject = state => getAppData(state).project;
export const getProjectsRequest = state => getAppData(state).getProjectsRequest;

export const getPermissions = state => getAppData(state).permissions;

export const getPlant = state => getAppData(state).plant;
export const getPlantSet = state => getAppData(state).plantSet;
export const getAllPlants = state => getAppData(state).allPlants;
export const fetchingAllPlants = state => getAppData(state).requested;

export const loadingPcs = state => getAppData(state).pcsLoading;
export const pcs = state => getAppData(state).pcs;
export const loadingPcsFailed = state => getAppData(state).loadError;

export const allBookmarked = state => getAppData(state).allBookmarked;
export const scope = state => getAppData(state).scope;
export const punch = state => getAppData(state).punch;
export const task = state => getAppData(state).task;

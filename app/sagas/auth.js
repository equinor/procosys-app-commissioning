import {
  put,
  call,
  select,
  take,takeLatest,all
} from 'redux-saga/effects';
import * as actions from '../actions';
import NavigationService from '../services/NavigationService';
import {AzureADClientId, ApiResourceIdentifier} from '../settings';
import {ReactNativeAD} from 'react-native-azure-ad';
import {Base64} from 'js-base64';





const delay = time => new Promise(resolve => setTimeout(resolve, time));

function* redirectToLogout() {
  try {
    /**
     * Redux OIDC sometimes starts flashing the message 'redux-oidc/USER_EXPIRED' 
     * everytime we update our internal state. 
     * So we are making sure that we dont get redirected to login everytime a state change happens in
     * our login and setup screen. 
     */
    let currentRouteKey = yield call(NavigationService.getCurrentRouteKey);
    if (currentRouteKey === 'LoginRoute' || currentRouteKey === 'SetupRoute') return;
    Analytics.trackEvent('SESSION_EXPIRED_REDIRECT_TO_LOGOUT');
    yield call(NavigationService.navigate, 'LogoutRoute');
    yield call(console.log, "Navigated to LogoutRoute, updating user");
    //yield put(USER_UPDATED(null));
  } catch (err) {
    console.log('Error while navigating', err);
    // Silent fail
    //Known issue: reference to AppNavigator is lost when AuthWebViewManager is open.
    //Reason: Children are not rendered while Webview is open, AppNavigator therefore doesnt exist.
  }
}

function* setUserInformation({payload}) {
  try {
    // We are using Base64 as atob() doesnt support utf-8 characters.
    const decoded = Base64.decode(payload.split(".")[1]);
    const data = JSON.parse(decoded);
    yield put(actions.USER_UPDATED(data));
    yield put(actions.USER_LOGGED_IN());
  } catch (error) {
    console.log('Error while decoding user token');
  }
}

function* expiryWatcher({payload}) {
  console.log('Setting expiry timer');
  try {
    if (!payload) throw new Exception('Missing access token');
      console.log('We do have a payload');
    const decoded = Base64.decode(payload.split(".")[1]);
    const data = JSON.parse(decoded);
    const timeLeft = new Date(data.exp*1000) - Date.now();
    const timeout = timeLeft - 60 * 1000;
    console.log('User expires in (s): ', timeout / 1000)
    yield call(delay,timeout);
    yield put(actions.USER_WILL_EXPIRE());
  } catch( err ) {
    console.log('Failed to set expiry', err.message)
    yield put(actions.USER_EXPIRED());
  }
}

function* renewTokenSilent() {
  console.log('Renewing token');
  try {
    const result = yield ReactNativeAD.getContext(AzureADClientId).assureToken(ApiResourceIdentifier);
    if (!result) {
      yield put(actions.USER_EXPIRED());
      console.log('Unable to renew token');

    } else {
      console.log('Token renewed: ', result);
      yield put(actions.ACCESS_TOKEN_RECEIVED(result));
    }
  } catch (err) {
    console.log('Crashed when renewing token', err.message);
    yield put(actions.USER_EXPIRED());
  }
}

export function* watchUserExpired(){
    yield all([
      takeLatest('Auth/USER_EXPIRED', redirectToLogout),
      takeLatest('Auth/USER_WILL_EXPIRE', renewTokenSilent),
      takeLatest('Auth/ACCESS_TOKEN_RECEIVED', setUserInformation),
      takeLatest('Auth/ACCESS_TOKEN_RECEIVED', expiryWatcher),
    ]);

}
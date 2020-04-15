import React, { Component } from 'react';
import GlobalFont from 'react-native-global-font';
import NetInfo from "@react-native-community/netinfo";
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import AppNavigator from './navigation';
import store from './store';

import {postFatal} from '../services/api';
import NavigationService from '../services/NavigationService';
import {setNativeExceptionHandler} from 'react-native-exception-handler';


setNativeExceptionHandler((errorString) => {
    console.log('Native Exception: ', errorString);
    postFatal({nativeException: errorString});
});

function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}

let unsubscribe = null;

export default class App extends Component {
  componentDidMount() {
    SplashScreen.hide();

    let fontName = 'Equinor-Regular';
    GlobalFont.applyGlobal(fontName);

    unsubscribe = NetInfo.addEventListener( (state) =>  {
      this.handleFirstConnectivityChange();
    });
  }

  componentWillUnmount() {
    unsubscribe && unsubscribe();
  }

  handleFirstConnectivityChange = (isConnected) => {
    //TODO test this
     if (store && store.default)
     {

       store.default.dispatch({
       type: 'Connectivity/SET',
       payload: true,
     });
    }
  }

  render() {
    var s = store();

    return (
      <Provider store={s}>
          <AppNavigator
          ref={navref => NavigationService.setTopLevelNavigator(navref)}
          style={{ backgroundColor: '#FFF' }}
          onNavigationStateChange={(prevState, currentState, action) => {
            const currentScreen = getActiveRouteName(currentState);
            const prevScreen = getActiveRouteName(prevState);
      
            //if (prevScreen !== currentScreen) {
              //AnalyticsService.trackEvent("SCREEN_CHANGED", { currentScreen, prevScreen});
            //}
          }}
        />
       </Provider>);
  }
}
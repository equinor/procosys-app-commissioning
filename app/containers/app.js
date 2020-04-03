import React, { Component } from 'react';
import GlobalFont from 'react-native-global-font';
import {
  Alert
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import RNRestart from 'react-native-restart';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import AppNavigator from './navigation';
import store from './store';

import { MenuContext } from 'react-native-popup-menu';

import NavigatorService from '../services/NavigationService';

import {postError, postFatal} from '../services/api';

import {setJSExceptionHandler, getJSExceptionHandler, setNativeExceptionHandler} from 'react-native-exception-handler';


// setJSExceptionHandler((e, isFatal) => {
//   console.log('App.js ExceptionHandler: ', e);


//     e = e || 'Unknown error';

//     console.log('App.js ExceptionHandler: ', e);
//     console.log('App.js ExceptionHandler - Message: ', e.message);
//     console.log('App.js ExceptionHandler - ToString: ', e.toString());

//     isFatal ? postFatal(e) : postError(e);
    

//     if (isFatal){
//     let error = e;
    

//     Alert.alert(
//       'Oh no! An error occurred',
//       `The maintenance team is notified and we will need to restart the app.
//         Error: ${(isFatal) ? 'Fatal:' : ''} ${error}
//       `,
//       [{
//         text: 'Restart',
//         onPress: () => {
//           RNRestart.Restart();
//         },
//         style: 'destructive'
//       },
//       {
//         text: 'Ignore',
//         style: 'cancel'
//       }]
//     );

//   }
// }, true);

setNativeExceptionHandler((errorString) => {
    console.log('Native Exception: ', errorString);
    postFatal({nativeException: errorString});
});

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
          <MenuContext>
            <AppNavigator ref={navigatorRef => {
            NavigatorService.setContainer(navigatorRef);
          }}/>
          </MenuContext>
       </Provider>);
  }
}
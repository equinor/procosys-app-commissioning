import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
    StatusBar,
    AppState, 
    SafeAreaView,
    TouchableOpacity,
    Text
} from 'react-native';

import {
    Image
} from '../atoms/StandardComponents';

import {connect} from 'react-redux';

import {getCurrentUser} from '../../reducers/currentUser';
import * as actions from '../../actions';

import {getVersion} from '../../reducers/version';
import * as colors from '../../stylesheets/colors';

import Button from '../atoms/Button';
import statoilLogo from '../../../resources/images/Equinor_logo.png';
import logo from '../../../resources/images/_logo.png';

import {ReactNativeAD, ADLoginView} from 'react-native-azure-ad';
import {
    AzureADClientId,
    AzureADRedirectUrl,
    BuildNumber,
    ApiResourceIdentifier,
    AzureADTenantId
  } from '../../settings';


/**
 * this.props.navigation.navigate('MainRoute');
 */
class LoginPage extends Component {

    constructor (props) {
        super(props);
        console.log('Login view loaded');

        this.state = {
            viewLogin: false,
            isValidating: false,
            appState: AppState.currentState
          };
      
          const ctxConfig = {
            client_id: AzureADClientId,
            redirectUrl: AzureADRedirectUrl,
            tenant: AzureADTenantId,
            resources: [
              ApiResourceIdentifier,
            ]
          }
      
          this._handleAppStateChange = this._handleAppStateChange.bind(this);
      
          AppState.addEventListener('change', this._handleAppStateChange);
      
          this.adContext = new ReactNativeAD(ctxConfig);
    }

    _handleAppStateChange(nextAppState) {
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            this.setState({viewLogin: false});
            setTimeout(() => this.setState({viewLogin: true}), 100);
        }

        this.setState({
            appState: nextAppState
        });
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    componentDidUpdate() {
        if (this.props.currentUser) {
            console.log('Navigating to MainRoute');
          this.props.navigation.navigate('MainRoute');
          return;
        }
    }

    validateLogin = async () => {
        console.log('Validating login');
        if (this.state.isValidating) {
          return;
        }
        try {
          this.setState({
            isValidating: true
          });
          let access_token = await ReactNativeAD.getContext(AzureADClientId).assureToken(ApiResourceIdentifier);
          if (access_token) {
            console.log('User is logged in: ', access_token);
            this.props.loginUser(access_token);
          }
        } catch (err) {
          console.log('Failed to get user session: ', err);
        } finally {
          this.setState({
            isValidating: false
          });
        }
        
    }


    onLoginButtonClick = () => {
        this.setState({
            viewLogin: true
          })
    }

    onCloseWebviewClick = () => {
        this.setState({viewLogin: false});
    }

    onAdLoginSuccess = (creds) => {
        console.log('Ad Login successfull: ', creds)
        this.setState({
          viewLogin: false
        });
        this.validateLogin();
    }

    renderLogin = () => {

        return (
          <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1}}>
              <ADLoginView onSuccess={this.onAdLoginSuccess} context={ReactNativeAD.getContext(AzureADClientId)} hideAfterLogin={true} />
            </View>
            <Button
                title={'Cancel'}
                onPress={this.onCloseWebviewClick}
                disabled={false}
                viewStyle={styles.buttonStyle}
                viewStyleDisabled={styles.buttonStyleDisabled}
                textStyleDisabled={styles.buttonTextStyleDisabled}
            />
          </SafeAreaView>
          );
    }

  render () {
    if (this.state.viewLogin) {
        return this.renderLogin();
    }
      return <View style={styles.wrapper}>
          <View style={styles.splashTop}>
              <Image source={statoilLogo} />
          </View>
          <View style={styles.splashBottom}>
              <View style={styles.splashAppLogo}>
                  <Image source={logo} />
              </View>
              <View style={styles.splashAction}>
                  <Button
                      title={'Log in'}
                      onPress={this.onLoginButtonClick}
                      disabled={false}
                      viewStyle={styles.buttonStyle}
                      viewStyleDisabled={styles.buttonStyleDisabled}
                      textStyleDisabled={styles.buttonTextStyleDisabled}
                  />
              </View>
          </View>
      </View>;

  }

}

LoginPage.propTypes = {
    'navigation': PropTypes.shape({'navigate': PropTypes.func}).isRequired,
    'appVersion': PropTypes.string,
};

LoginPage.defaultProps = {
    'appVersion': null,
};

LoginPage.navigationOptions = ({navigation}) => ({
    'headerStyle': {
        'backgroundColor': '#fff',
        'borderBottomColor': '#fff',
        'height': 0
    }
});


const styles = StyleSheet.create({
    'wrapper': {
        'flex': 1,
        'flexDirection': 'column'
    },
    'splashTop': {
        'flex': 2,
        'justifyContent': 'center',
        'alignItems': 'center',
        'backgroundColor': 'white'
    },
    'splashBottom': {
        'flex': 3,
        'backgroundColor': colors.PINK_LIGHT,
        'justifyContent': 'center',
        'alignItems': 'center'
    },
    'splashAppLogo': {
        'flex': 7,
        'justifyContent': 'center',
        'alignItems': 'center'
    },
    'splashAction': {
        'flex': 3,
        'justifyContent': 'center',
        'alignItems': 'center'
    },
    'buttonStyle': {'backgroundColor': colors.PINK},
    'buttonStyleDisabled': {'backgroundColor': colors.GRAY_3},
    'debugTextStyle': {'color': colors.BLUE_LIGHT},
    'buttonTextStyleDisabled': {}
});

const mapDispatchToProps = (dispatch) => ({
    'loginUser': (token) => dispatch(actions.ACCESS_TOKEN_RECEIVED(token)),
});

const mapStateToProps = (state) => ({
    'appVersion': getVersion(state),
    'currentUser': getCurrentUser(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);

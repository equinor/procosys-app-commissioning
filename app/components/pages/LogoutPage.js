import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
} from 'react-native';


import {USER_UPDATED, USER_LOGGED_OUT} from '../../actions';
import {AzureADClientId, ApiResourceIdentifier} from '../../settings';
import {ADLoginView, ReactNativeAD} from 'react-native-azure-ad';
import CookieManager from '@react-native-community/cookies';

import {connect} from 'react-redux';

import {getCurrentUser} from '../../reducers/currentUser';
import NavigationService from '../../services/NavigationService';

class LogoutPage extends Component {

    constructor (props) {
        super(props);

    }

    componentDidUpdate() {
      if (!this.props.currentUser) {
        try {
          NavigationService.reset('LoginRoute');
        } catch(err) {
          console.log('Error occured: ', err);
          console.log('err message: ', err.message);
        }
        this.props.logout();

      }
    }
  
    onADURLChanged = async (webview) => {
      console.log('URL changed');
      if (webview.url.toLowerCase().indexOf('logout') <= -1) {
        try {
          await CookieManager.clearAll(true);
          const ctx = ReactNativeAD.getContext(AzureADClientId);
          if (ctx) {
            console.log('My context', ctx);
            await ctx.deleteCredentials(ApiResourceIdentifier);
            ReactNativeAD.removeContext(AzureADClientId);
          }
          
        } catch (err) {
          console.log('Error while logging out: ', err.message);
        } finally {
          this.props.clearUser();
        }
        
      }
    }

  render () {

    return (
    <SafeAreaView style={styles.wrapper}>
      <View style={{flex: 1}}>
        <ADLoginView onSuccess={() => {}} context={ReactNativeAD.getContext(AzureADClientId)} hideAfterLogin={true} needLogout={true} onURLChange={this.onADURLChanged} />
      </View>
    </SafeAreaView>);
  }

}

LogoutPage.propTypes = {
};

LogoutPage.defaultProps = {
};

LogoutPage.navigationOptions = ({navigation}) => ({
    'headerStyle': {
        'backgroundColor': '#fff',
        'borderBottomColor': '#fff',
        'height': 0
    }
});


const styles = StyleSheet.create({
    'wrapper': {
        'flex': 1,
    }
});

const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(USER_LOGGED_OUT()),
    clearUser: () => dispatch(USER_UPDATED(null))
});

const mapStateToProps = (state) => ({
    'currentUser': getCurrentUser(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(LogoutPage);

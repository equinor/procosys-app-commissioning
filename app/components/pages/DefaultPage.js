import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as actions from '../../actions';
import {connect} from 'react-redux';
import * as Colors from '../../stylesheets/colors';
import {moderateScale} from '../../utils/scaling';
import {globalStyles} from '../../settings';

import {
    View,
    StyleSheet,
    StatusBar,
    Alert
} from 'react-native';
import {renderPackageStatus} from '../molecules/StatusRender';

import {TouchableOpacity, Text, Container, ScrollView} from '../atoms/StandardComponents';

import Icon from 'react-native-vector-icons/Ionicons';

import * as appReducer from '../../reducers/appData';

const styles = StyleSheet.create({
    'component': {
        'flex': 1,
        'backgroundColor': 'white'
    },
    'row': {'flexDirection': 'row'},

    'summary': {

        'borderBottomWidth': 1,
        'backgroundColor': 'white',
        'padding': 10,
        'paddingTop': 20,
        'paddingBottom': 20,
        'borderBottomColor': Colors.GRAY_3
    },
    'resultSummary': {
        'backgroundColor': Colors.GRAY_3,
        'padding': 10
    },
    'title': {
        'flex': 9,
        ...globalStyles.title,
        'color': Colors.GRAY_1
    },

    'detail': {'flex': 1},
    'detailHeader': {
        'flex': 1,

        'color': Colors.GRAY_2
    },
    'iconView': {
        'flex': 1,

        'paddingRight': 10,
        'paddingLeft': moderateScale(10),
        'alignSelf': 'flex-end'
    },
    'statusView': {
        'flex': 1,
        'paddingLeft': moderateScale(5),
        'paddingTop': moderateScale(2)
    },
    'menuView': {
        'flex': 1,
        'width': 30,

        'justifyContent': 'center'
    }

});

class DefaultPage extends Component {

  static propTypes = {
      'navigation': PropTypes.object.isRequired,
      'getPlant': PropTypes.func.isRequired,
      'allBookmarked': PropTypes.array,
      'plantSet': PropTypes.bool,
      'requestAllBookmarks': PropTypes.func.isRequired,
      'commitBookmarks': PropTypes.func.isRequired,
      'removeBookmark': PropTypes.func.isRequired,
      'addBookmark': PropTypes.func.isRequired,
      'loadPackage': PropTypes.func.isRequired
  }


  componentDidMount () {

      this.props.getPlant();
      if (!this.props.allBookmarked) {

          this.props.requestAllBookmarks();

      }
      if (this.props.commitBookmarks) {

          this.props.navigation.setParams({'commitBookmarks': this.props.commitBookmarks});

      }

      StatusBar.setHidden(false);
      StatusBar.setBarStyle('light-content', true);

  }

  UNSAFE_componentWillUpdate (nextProps) {

      if (!this.props.permissions && nextProps.permissions) {

          if (!nextProps.permissions.canUseApp) {

              Alert.alert(`You don't have enough access rights to use this app. Contact support, and log in again`);
              this.props.navigation.navigate('LoginRoute');
              return;

          }

      }

      if (this.props.plantSet !== false && nextProps.plantSet === false) {

          this.props.navigation.navigate('PlantRoute');

      }

      if ((!this.props.project && nextProps.project) || (this.props.project && nextProps.project && this.props.project.Id !== nextProps.project.Id)) {

          this.props.navigation.setParams({'project': nextProps.project});

      }

  }

  static navigationOptions = ({navigation}) => ({
      'title': 'Comm ProCoSys',
      'titleStyle': {'fontFamily': globalStyles.fontFamily},
      'headerLeft':
      <TouchableOpacity style={{
          'paddingLeft': 15,
          'paddingRight': 15
      }}
      onPress={() => {

          navigation.state.params.commitBookmarks();
          navigation.navigate('SettingsRoute');

      }}
      >
          <View style={styles.menuView}>
              <Icon name="md-more" color="black" size={moderateScale(25)} />
          </View>
      </TouchableOpacity>,
      'headerBackTitle': 'Back',
      'headerRight':
      <TouchableOpacity style={{
          'paddingLeft': 15,
          'paddingRight': 15
      }} onPress={() => {

          navigation.state.params.commitBookmarks();
          navigation.navigate('SearchRoute', {title: 'Search ' + ((navigation.state.params.project && navigation.state.params.project.Id) ? `${navigation.state.params.project.Description}` : 'all projects') });

      }} >
          <View style={styles.menuView}>
              <Icon name="md-search" color="black" size={moderateScale(25)} />
          </View>
      </TouchableOpacity>


  });

  renderOne (item) {

      return (
          <View style={styles.summary}>
              <View style={styles.row}>
                  <Text style={styles.title}>{item.Description}</Text>
                  <View style={styles.statusView}>
                      {renderPackageStatus(item, 2)}

                  </View>
                  {!item.removed
                      ? <TouchableOpacity onPress={() => this.props.removeBookmark(item)}>
                          <View style={styles.iconView}>
                              <Icon name="ios-bookmark" color={Colors.BLUE} padding={10} paddingRight={20} size={moderateScale(25)} />
                          </View>
                      </TouchableOpacity>
                      : <TouchableOpacity onPress={() => this.props.addBookmark(item)}>
                          <View style={styles.iconView}>
                              <Icon name="ios-bookmark" color={Colors.BLUE_LIGHT} padding={10} paddingRight={20} size={moderateScale(25)} />
                          </View>
                      </TouchableOpacity>
                  }
              </View>

              <View style={styles.row}>
                  <Text style={styles.detailHeader}>COM PKG</Text>
                  <Text style={styles.detail}>{item.CommPkgNo}</Text>
                  <Text style={styles.detailHeader}>  MC status</Text>
                  <Text style={styles.detail}>{item.McStatus}</Text>
              </View>

          </View>
      );

  }

  render () {

      return this.props.plantSet === undefined ? <View></View>
          : <Container>
              <View style={{...styles.component}}>
                  <ScrollView>
                      {this.props.allBookmarked && this.props.allBookmarked.length > 0

                          ? this.props.allBookmarked.map((item) => <TouchableOpacity key={item.Id} onPress={() => {

                              this.props.commitBookmarks();
                              this.props.navigation.navigate('PackageRoute');
                              this.props.loadPackage(item);

                          }}>
                              {this.renderOne(item)}</TouchableOpacity>)
                          : <Text style={{
                              'fontSize': 24,
                              'padding': 10,
                              'textAlign': 'center'
                          }}>No bookmarked packages</Text>
                      }
                  </ScrollView>
              </View>
          </Container>;

  }

}

const mapStateToProps = (state) => ({
    'allBookmarked': appReducer.allBookmarked(state),
    'plant': appReducer.getPlant(state),
    'plantSet': appReducer.getPlantSet(state),
    'project': appReducer.getProject(state),
    'permissions': appReducer.getPermissions(state)
});

const mapDispatchToProps = (dispatch) => ({

    'getPlant': () => dispatch(actions.plantRequest()),
    'commitBookmarks': (items) => dispatch(actions.commitBookmarks(items)),
    'requestAllBookmarks': () => dispatch(actions.allBookmarkedRequested()),
    'addBookmark': (pcs) => dispatch(actions.addBookmark(pcs, true)),
    'removeBookmark': (pcs) => dispatch(actions.removeBookmark(pcs, true)),
    'loadPackage': (item) => dispatch(actions.loadPcs(item))

});
export default connect(mapStateToProps, mapDispatchToProps)(DefaultPage);

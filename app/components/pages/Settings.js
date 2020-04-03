import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  SectionList,
  StyleSheet,
  View
} from 'react-native';
import {Text} from '../atoms/StandardComponents';
import {globalStyles} from '../../settings';

import {connect} from 'react-redux';
import TextLink from '../atoms/TextLink';
import LogoutButton from '../molecules/LogoutButton';
import * as Colors from '../../stylesheets/colors';

import {getCurrentUser} from '../../reducers/currentUser';
import * as appReducer from '../../reducers/appData';
import NavigationService from '../../services/NavigationService';


const styles = StyleSheet.create({
  'page': {'flex': 1},
  'sectionSeparator': {
    'borderBottomWidth': 1,
    'borderBottomColor': Colors.GRAY_3
  },
  'itemContainer': {
    'backgroundColor': 'white',
    'height': 46,
    'borderBottomWidth': 1,
    'borderBottomColor': Colors.GRAY_3,
    'paddingHorizontal': 15,
    'paddingVertical': 10
  },
  'sectionHeaderContainer': {'height': 30},
  'itemText': {
    'lineHeight': 30,
    'fontSize': 16,
    'color': Colors.BLUE,
    'alignSelf': 'flex-start'
  },
  'textStyle': {
    'color': Colors.GRAY_1,
    'fontSize': 16,
    'alignSelf': 'flex-start'
  },
  'viewStyle': {
    'paddingHorizontal': 0,
    'paddingVertical': 0
  }
});

const aboutListTitle = 'About app';
const loggedInAsText = 'Logged in as';
const logOutText = 'Log out';
const selectPlantTitle = 'Change plant';

class SettingsPage extends Component {

  static propTypes = {'navigation': PropTypes.shape({'state': PropTypes.object}).isRequired};

   static navigationOptions = (state) => ({'title': 'Settings','titleStyle': {
            'fontFamily': globalStyles.fontFamily
          }});

   UNSAFE_componentWillReceiveProps (nextProps) {

     if (!nextProps.currentUser) {

       this.props.navigation.navigate('LoginRoute');

     }

   }

  RenderItem = (props) => {

    if (props.item.key === 'User') {

      return this.TextItem(props);

    }
    return this.LinkItem(props);

  };

  LinkItem = ({item}) =>
    <View style={styles.itemContainer}>
      <TextLink
        textStyle={styles.itemText}
        data={item}
        nav={this.props.navigation}
      />
    </View>
  ;

  TextItem = ({item}) =>
    <View style={styles.itemContainer}>
      <Text style={styles.textStyle}>
        {item.name}
      </Text>
    </View>
  ;

  logout = () => {

    const um = userManager();
    um.signoutPopup();

  }


  ButtonItem = ({item}) => {

    if (item.key === 'Logout') {

      return <LogoutButton data={item} nav={NavigationService} />;

    }

  }

  renderSectionHeader = () =>
    <View style={styles.sectionHeaderContainer} />
  ;

  render () {
    if (!this.props.currentUser) return <></>;

    const {page, list, sectionSeparator} = styles;

    const sections = [
      {
        'key': 'Links',
        'renderItem': this.RenderItem,
        'data': [
          {
            'name': aboutListTitle,
            'key': 'About',
            'route': 'AboutRoute'
          },
          {
            'name': this.props.plant ? this.props.plant.Title : selectPlantTitle,
            'key': 'Plant',
            'route': 'PlantRoute'
          },
          {
            'name': (this.props.project  && this.props.project.Id) ? this.props.project.Description : 'All Projects',
            'key': 'Project',
            'route': 'ProjectRoute'
          },
          {
            'name': `${loggedInAsText}: ${this.props.currentUser.name}`,
            'key': 'User'
          }
        ]
      },
      {
        'key': 'Buttons',
        'renderItem': this.ButtonItem,
        'data': [
          {
            'text': logOutText,
            'key': 'Logout'
          }
        ]
      }
    ];

    return (
      <View style={page}>
        <SectionList
          style={list}
          sections={sections}
          renderSectionHeader={this.renderSectionHeader}
          SectionSeparatorComponent={() => <View style={sectionSeparator} />}
          removeClippedSubviews={false}
          underlayColor={Colors.RED}
        />
      </View>
    );

  }

}

const mapStateToProps = (state) => ({
  'currentUser': getCurrentUser(state),
  'plant': appReducer.getPlant(state),
  'project': appReducer.getProject(state),

});

export default connect(mapStateToProps)(SettingsPage);

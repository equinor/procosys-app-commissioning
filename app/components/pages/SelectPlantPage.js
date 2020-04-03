import React, {Component} from 'react';
import {
  View,
  StyleSheet, TouchableWithoutFeedback
} from 'react-native';

import {Text, ScrollView} from '../atoms/StandardComponents';

import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import DeviceInfo from 'react-native-device-info';
import Spinner from '../atoms/Spinner';
import * as Colors from '../../stylesheets/colors';
import {moderateScale} from '../../utils/scaling';
import {globalStyles} from '../../settings';

// Somewhere in your app
import {RadioButtons} from 'react-native-radio-buttons';

import * as actions from '../../actions';
import * as appReducer from '../../reducers/appData';

const styles = StyleSheet.create({
  'container': {
    'flex': 1,
    'paddingTop': 50,
    'justifyContent': 'center',
    'backgroundColor': Colors.GRAY_4
  },
  'footer': {
    'height': 50,
    'flexDirection': 'row',
    'alignItems': 'center',
    'justifyContent': 'center',
    'borderColor': Colors.GRAY_2,
    'borderTopWidth': 0.5
  },
  'titleHeader': {
    'marginVertical': 15,
    'alignSelf': 'center',
    'fontWeight': '500',
    'fontSize': 30,
    'color': Colors.GRAY_1
  },
  'subtitleHeader': {
    'fontSize': 20,
    'marginVertical': 5,
    'color': Colors.GRAY_1
  },
  'changelogText': {
    'marginVertical': 1,
    'color': Colors.GRAY_1
  },
  'bullet': {
    'marginVertical': 1,
    'marginRight': 5,
    'color': Colors.GRAY_1
  },
  'buttonStyle': {
    'backgroundColor': '#0288D1',
    'margin': 20
  },
  'bulletList': {'flexDirection': 'row'},
  'changelogItem': {
    'marginBottom': 15,
    'marginTop': 20,
    'paddingHorizontal': 20
  }
});

const featureTitle = 'What\'s new';
const affirmText = 'OK';

class SelectPlantPage extends Component {

  static propTypes = {
    'navigation': PropTypes.object.isRequired,
  }

  static navigationOptions = (state) => ({'title': 'Select plant', 'titleStyle': {
           'fontFamily': globalStyles.fontFamily
         },
});


UNSAFE_componentWillMount () {

    const version = DeviceInfo.getVersion();
    this.props.getPlant();
    if (!this.props.allPlants && !this.props.fetchingAllPlants) {

      this.props.getAllPlants();

    }
    if (this.props.commitBookmarks) {

      this.props.navigation.setParams({'commitBookmarks': this.props.commitBookmarks});

    }

  }

  renderOption (option, selected, onSelect, index) {

    const textStyle = {
      'lineHeight': 30,
      'fontSize': 16,
      'color': Colors.BLUE,
      'alignSelf': 'flex-start'
    };
    const baseStyle = {'flexDirection': 'row'};
    let style;
    let checkMark;

    if (index > 0) {

      style = [
        baseStyle,
        {
          'borderTopColor': '#eeeeee',
          'borderTopWidth': 1
        }
      ];

    } else {

      style = baseStyle;

    }
    style = {
      'backgroundColor': 'white',
      'height': 46,
      'borderBottomWidth': 1,
      'borderBottomColor': Colors.GRAY_3,
      'paddingHorizontal': 15,
      'paddingVertical': 10
    };
    if (selected) {

      checkMark = <Text style={{
        ...textStyle,
        'alignSelf': 'flex-end'
      }}>✓</Text>;

    }

    return (
      <TouchableWithoutFeedback onPress={onSelect} key={index}>
        <View style={style}>
          <Text style={textStyle}>{selected ? ' ✓ ' : '     '}{option.Title}</Text>
          {/* <Text style={{alignSelf:'flex-end'}}> ✓ </Text> */}
        </View>
      </TouchableWithoutFeedback>
    );

  }

  renderContainer (optionNodes) {

    return <View style={{
      'backgroundColor': 'white',
      'paddingLeft': 1,
      'borderTopWidth': 1,
      'borderTopColor': '#cccccc',
      'borderBottomWidth': 1,
      'borderBottomColor': '#cccccc'
    }}>{optionNodes}</View>;

  }
  render () {


    const {
      container,
      footer,
      titleHeader
    } = styles;

    if (!this.props.allPlants) {

      return <Spinner />;

    }
    return (

      <View style={{'margin': 0}}>
        <ScrollView>
          {this.props.allPlants
            ? <RadioButtons
              options={ this.props.allPlants }
              onSelection={(val) => {
                if (!this.props.plant || (this.props.plant.Id !== val.Id)) {

                  this.props.setPlant(val);
                  //  this.props.navigation.goBack();
                  this.props.navigation.navigate('ProjectRoute', {fromProject:true});
                }
                else {
                  this.props.setPlant(val);
                  this.props.navigation.goBack();

                }


              } }
              selectedOption={this.props.plant }
              extractText={ (option) => option.Title }
              renderOption={ this.renderOption }
              renderContainer={ this.renderContainer }
              optionContainerStyle={{'flex': 1}}
              testOptionEqual={(selectedValue, option) => selectedValue && selectedValue.Id === option.Id}
            />
            : null }
        </ScrollView>
      </View>);

  }

}

const mapDispatchToProps = (dispatch) => ({
  'setPlant': (p) => dispatch(actions.plantSet(p)),
  'getPlant': (p) => dispatch(actions.plantRequest(p)),
  'getAllPlants': (p) => dispatch(actions.allPlantsRequested(p)),
  'commitBookmarks': (items) => dispatch(actions.commitBookmarks(items))

});

const mapStateToProps = (state) => ({

  'plant': appReducer.getPlant(state),
  'plantIsSet': appReducer.getPlantSet(state),
  'allPlants': appReducer.getAllPlants(state),
  'fetchingPlants': appReducer.fetchingAllPlants(state)
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectPlantPage);

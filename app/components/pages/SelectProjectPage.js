import React, {Component} from 'react';
import {
  View,
  StyleSheet, TouchableWithoutFeedback
} from 'react-native';

import {Text, ScrollView} from '../atoms/StandardComponents';

import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../atoms/Spinner';
import * as Colors from '../../stylesheets/colors';
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

class SelectProjectPage extends Component {

  static propTypes = {
    'navigation': PropTypes.object.isRequired,
  }

  static navigationOptions = (state) => ({'title': 'Select project','titleStyle': {
           'fontFamily': globalStyles.fontFamily
         }});


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
          <Text style={textStyle}>{selected ? ' ✓ ' : '     '}{option.Description}</Text>
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

    if (!this.props.projects) {

      return <Spinner />;

    }
    return (

      <View style={{'margin': 0}}>
        <ScrollView>
          {this.props.projects && !this.props.projectsRequest
            ? <RadioButtons
              options={ this.props.projects }
              onSelection={(val) => {

                this.props.setProject(val);
                if (this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.fromProject) {

                  this.props.navigation.pop(2);

                }

                else {
                  this.props.navigation.goBack();
                }

              } }
              selectedOption={this.props.project }
              extractText={ (option) => option.Description }
              renderOption={ this.renderOption }
              renderContainer={ this.renderContainer }
              optionContainerStyle={{'flex': 1}}
              testOptionEqual={(selectedValue, option) => selectedValue && selectedValue.Id === option.Id}
            />
            : <Spinner/> }
        </ScrollView>
      </View>);

  }

}

const mapDispatchToProps = (dispatch) => ({
  'setProject': (p) => dispatch(actions.projectNewSet(p))
});


const mapStateToProps = (state) => ({
  'projects': appReducer.getProjects(state),
  'project': appReducer.getProject(state),
  'projectsRequest': appReducer.getProjectsRequest(state)
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectProjectPage);

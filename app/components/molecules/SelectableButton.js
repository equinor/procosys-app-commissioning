import React from 'react';
import { View} from 'react-native';

import {TouchableOpacity, Text, Image} from '../atoms/StandardComponents';
import { moderateScale } from '../../utils/scaling';
import * as Colors from '../../stylesheets/colors';

const counter = (count, selected, radius) => {

  if (count === undefined) return null;

  radius = radius || 40;
  const half = radius / 2;
  let width = radius;
  if (count > 9) {

    width *= 2;

  }
  const color = Colors.RED;

  const inside = {
    'borderRadius': half,
    // Position: 'absolute',
    'top': 0,
    'left': 0,
    width,
    'height': radius,
    'alignItems': 'center',
    'justifyContent': 'center',
    'backgroundColor': color
  };
  return (
    <View style={inside}><Text style={{
      'color': 'white',
      'backgroundColor': 'transparent'
    }}>{count}</Text></View>
  );

};

const SelectableButton = (props) => {
  return <TouchableOpacity onPress={() => props.onPress()}>
<View style={{justifyContent:'center', alignItems: 'center', marginTop:13}}>
    <View>
    {props.iconImage ? <View style={{
      //'alignSelf': 'center',
      'width': moderateScale(20),
      'height': moderateScale(20)
    }}>{props.iconImage}</View> : props.isSelected
      ? <Image style={{
        //'alignSelf': 'center',
        'width': moderateScale(20),
        'height': moderateScale(20)
      }} resizeMode="stretch" source={props.iconBlue} />
      : <Image style={{
  //      'alignSelf': 'center',
        'width': moderateScale(20),
        'height': moderateScale(20)
      }} resizeMode="stretch" source={props.iconBlack} />
    }

    <View style={{
      'position': 'absolute',
      'top': moderateScale(-8),
      'marginLeft': moderateScale(15)
    }}>
      {counter(props.count, props.isSelected, 20)}
    </View>
    </View>
  </View>
    <Text style={{
      'height': 15,
      'color': props.isSelected ? Colors.BLUE : 'black',
      'textAlign': 'center'
    }}></Text>
    <Text style={{
      'color': props.isSelected ? Colors.BLUE : 'black',
      'textAlign': 'center'
    }}>{props.title}</Text>
  </TouchableOpacity>
};

export default SelectableButton;

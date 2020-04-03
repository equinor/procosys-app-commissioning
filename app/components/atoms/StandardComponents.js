import React from 'react';
import {
  Text as ReactText,
  TouchableOpacity as ReactTouchableOpacity,
  View as ReactView,
  TextInput as ReactTextInput,
  Image as ReactImage,
  ScrollView as ReactScrollView,

  View

} from 'react-native';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/Ionicons';
import {moderateScale} from '../../utils/scaling';
import * as Colors from '../../stylesheets/colors';

import {combineTwo} from '../../utils/misc';

import Spinner from './Spinner';

import ModalDropdown from './ModalDropdown';

import DelayTextInput from './DelayTextInput';

import {globalStyles} from '../../settings';

// Attempt to make standard components
export function Text (props) {

  return (
    <ReactText setNativeProps={props.setNativeProps} style={[
      globalStyles.textProps,
      props.style
    ]}>
      {props.children}
    </ReactText>
  );

}

export function TextInput (props) {

  return (
    <DelayTextInput
      autoCorrect={false}
      onPauseText={props.onPauseText}
      setNativeProps={props.setNativeProps}
      pauseDelay={props.pauseDelay}
      tint={props.tint}
      maxLength={props.maxLength}
      tintColor={props.tintColor}
      selectionColor={props.selectionColor}
      autoCorrect={props.autoCorrect}
      onChangeText={props.onChangeText}
      blurOnSubmit={props.blurOnSubmit}
      onSubmitEditing={props.onSubmitEditing}
      placeholderTextColor={props.placeholderTextColor}
      keyboardType={props.keyboardType}
      returnKeyType={props.returnKeyType}
      underlineColorAndroid="rgba(0,0,0,0)" multiline={props.multiline} value={props.value} placeholder={props.placeholder} onChange={props.onChange} onChangeText={props.onChangeText} style={[
        globalStyles.textInputProps,
        props.style
      ]}/>
  );

}

export function TouchableOpacity (props) {

  return (
    <ReactTouchableOpacity setNativeProps={props.setNativeProps} disabled={Boolean(props.disabled)} onPress={props.disabled ? () => {} : props.onPress} hitSlop={{
      'top': 5,
      'right': 10,
      'left': 10,
      'bottom': 5
    }} style={[
      globalStyles.touchableOpacityProps,
      props.style
    ]}>
      {props.children}
    </ReactTouchableOpacity>
  );

}


export function Image (props) {

  return (
    <ReactImage setNativeProps={props.setNativeProps} source={props.source} resizeMode={props.resizeMode} resizeMethod={props.resizeMethod} style={[
      globalStyles.imageProps,
      props.style
    ]}/>
  );

}

export function Container (props) {

  return (
    <ReactView setNativeProps={props.setNativeProps} style={[
      globalStyles.containerProps,
      props.style
    ]}>
      {props.children}
    </ReactView>
  );

}

const renderButtonContent = (text, props) => (
  <View  style={
    {
      alignSelf: 'flex-start',
      flex:1,
      flexDirection:'row',
    //  width:props.width || moderateScale(310),
      borderWidth:1,
      borderRadius: 6,
      borderColor:Colors.GRAY_3

  }
    }>
      <Text style={[

        globalStyles.textProps,
        {padding:15,margin:4,  flex:92,},
        props.textStyle
      ]}
      >
        {text}
      </Text><Icon style={{
        flex:8,
        'alignSelf': 'center'
      }} name="ios-arrow-down" color={Colors.GRAY_2} size={(24)} /></View>
)
export function DropdownCodeDesc (props){
  if (!props.ready) {
    return <Spinner />
  }

  let defaultValue = props.defaultValue || 'Select...';
  if (props.ready && props.selected){
    let selectedItem = _.find(props.data(), i => i.Id === props.selected || i.Code === props.selected);
    if (selectedItem) defaultValue = combineTwo(selectedItem.Code, selectedItem.Description);
  }


  var renderRow = function(row) {
    return (<ReactTouchableOpacity>
        <ReactText style={[
          globalStyles.textProps,
          {padding:15, width:props.width || moderateScale(330)},
          ]}>
          {combineTwo(row.item.Code, row.item.Description)}
        </ReactText>
      </ReactTouchableOpacity>)
  }

  var getButtonText = function(row) {
    return combineTwo(row.item.Code, row.item.Description);
  }

  return (
    <ModalDropdown 
      renderButtonContent={renderButtonContent} 
      onSelect={props.onSelect} 
      defaultValue={defaultValue}  
      options={props.data()} 
      renderRow={renderRow}
      renderButtonText={getButtonText} 
    />
  );
}
export function RowContainer (props) {

  return (
    <ReactView setNativeProps={props.setNativeProps} style={[
      globalStyles.viewProps,
      {'flexDirection': 'row', 'flex':1},
      props.style
    ]}>
      {props.children}
    </ReactView>
  );

}

export function ScrollView (props) {

  return (
    <ReactScrollView setNativeProps={props.setNativeProps} horizontal={props.horizontal} keyboardShouldPersistTaps="always" style={props.style}>
      {props.children}
    </ReactScrollView>
  );

}

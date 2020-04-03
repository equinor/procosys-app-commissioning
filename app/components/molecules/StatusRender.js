import React from 'react';
import {moderateScale} from '../../utils/scaling';

import greenStatus from '../../../resources/images/scopeStatusGreen.png';
import greyStatus from '../../../resources/images/scopeStatusGrey.png';
import paStatus from '../../../resources/images/scopeStatusPa.png';
import pbStatus from '../../../resources/images/scopeStatusPb.png';
import paStatusSelected from '../../../resources/images/scopeStatusPa_selected.png';
import pbStatusSelected from '../../../resources/images/scopeStatusPb_selected.png';
import statusEmptySelected from '../../../resources/images/scopeStatus_selected.png';
import statusEmpty from '../../../resources/images/scopeStatus.png';

import leftGrey from '../../../resources/images/status/left_grey.png';
import leftYellow from '../../../resources/images/status/left_yellow.png';
import leftGreen from '../../../resources/images/status/left_green.png';
import leftRed from '../../../resources/images/status/left_red.png';

import rightYellow from '../../../resources/images/status/right_yellow.png';
import rightGrey from '../../../resources/images/status/right_grey.png';
import rightGreen from '../../../resources/images/status/right_green.png';
import rightRed from '../../../resources/images/status/right_red.png';

import _ from 'lodash';

import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator, Button, Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
  'scopeImageStyle': {
    'alignSelf': 'center',
    'height': moderateScale(18),
    'width': moderateScale(18),
    'borderWidth': 0,
    'borderRadius': moderateScale(9)
  },
  'scopeImageStyleWide': {
    'alignSelf': 'center',
    'height': moderateScale(18),
    'width': moderateScale(24),
    'borderWidth': 0

  },
  'pckStatusStyle': {
    'borderWidth': 0,
    'alignSelf': 'center'
  }
});

// TODO set to proper statues
export default function renderScopeStatus (status) {

  switch (status) {

  case 'OS':
    return <Image style={styles.scopeImageStyle} source={greyStatus} resizeMode="stretch"/>;
    break;
  case 'OK':
    return <Image style={styles.scopeImageStyle} source={greenStatus} resizeMode="stretch"/>;
    break;
  case 'PA':
    return <Image style={styles.scopeImageStyleWide} source={paStatus} resizeMode="stretch"/>;
    break;
  case 'PB':
    return <Image style={styles.scopeImageStyleWide} source={pbStatus} resizeMode="stretch"/>;
    break;
  default:
    return <Text style={{
      'textAlign': 'center',
      'textAlign': 'center',
      'borderColor': 'transparent',
      'borderRadius': 4,
      'paddingTop': 4,
      'borderWidth': 2,
      'marginLeft': '5%',
      'marginRight': '15%',
      'color': 'transparent',
      'backgroundColor': 'transparent'
    }}>{status}</Text>;

  }

}


export function renderTaskStatus (task) {

  return (task.IsSigned || task.SignedAt) ? <Image style={styles.scopeImageStyle} source={greenStatus} resizeMode="stretch"/> : <Image style={styles.scopeImageStyle} source={greyStatus} resizeMode="stretch"/>;

}

export const highestStatus = (listWithStatus) => {

  if (_.find(listWithStatus, (item) => item.Status === 'PA')) {

    return 'PA';

  }
  if (_.find(listWithStatus, (item) => item.Status === 'PB')) {

    return 'PB';

  }

  return 'Unknown';

};

export function renderPunchStatus (status, selected) {

  switch (status) {

  case 'PA':
    return selected ? <Image style={styles.scopeImageStyleWide} source={paStatusSelected} resizeMode="stretch"/> : <Image style={styles.scopeImageStyleWide} source={paStatus} resizeMode="stretch"/>;
    break;
  case 'PB':
    return selected ? <Image style={styles.scopeImageStyleWide} source={pbStatusSelected} resizeMode="stretch"/> : <Image style={styles.scopeImageStyleWide} source={pbStatus} resizeMode="stretch"/>;
    break;
  default:
    return selected ? <Image style={styles.scopeImageStyleWide} source={statusEmptySelected} resizeMode="stretch"/> : <Image style={styles.scopeImageStyleWide} source={statusEmpty} resizeMode="stretch"/>;

  }

}

export function renderPackageStatus (pck, size) {

  size = size || 1;
  //size =2;
  return <View style={{'flex': 1}}>
    <View style={{'flexDirection': 'row'}}>
      {
        pck.CommStatus == 'OK' ? <Image style={{
          ...styles.pckStatusStyle,
          'height': moderateScale(8) * size,
          'width': moderateScale(4) * size
        }} source={leftGreen}/>
          : pck.CommStatus == 'OS' ? <Image style={{
            ...styles.pckStatusStyle,
            'height': moderateScale(8) * size,
            'width': moderateScale(4) * size
          }} source={leftGrey}/>
            : pck.CommStatus == 'PA' ? <Image style={{
              ...styles.pckStatusStyle,
              'height': moderateScale(8) * size,
              'width': moderateScale(4) * size
            }} source={leftRed}/>
              : pck.CommStatus == 'PB' ? <Image style={{
                ...styles.pckStatusStyle,
                'height': moderateScale(8) * size,
                'width': moderateScale(4) * size
              }} source={leftYellow}/> : null
      }
      {
        pck.McStatus == 'OK' ? <Image style={{
          ...styles.pckStatusStyle,
          'height': moderateScale(8) * size,
          'width': moderateScale(4) * size
        }} source={rightGreen}/>
          : pck.McStatus == 'OS' ? <Image style={{
            ...styles.pckStatusStyle,
            'height': moderateScale(8) * size,
            'width': moderateScale(4) * size
          }} source={rightGrey}/>
            : pck.McStatus == 'PA' ? <Image style={{
              ...styles.pckStatusStyle,
              'height': moderateScale(8) * size,
              'width': moderateScale(4) * size
            }} source={rightRed}/>
              : pck.McStatus == 'PB' ? <Image style={{
                ...styles.pckStatusStyle,
                'height': moderateScale(8) * size,
                'width': moderateScale(4) * size
              }} source={rightYellow}/> : null

      }
    </View>
  </View>;

}

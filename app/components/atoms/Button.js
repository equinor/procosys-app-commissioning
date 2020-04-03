import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  TouchableOpacity, View
} from 'react-native';
import * as Colors from '../../stylesheets/colors';
import {scale, moderateScale, verticalScale} from '../../utils/scaling';

const styles = {
  'defaultTextStyle': {
    'alignSelf': 'center',
    'textAlign':'center',
    'color': 'white',
    'backgroundColor': 'rgba(0,0,0,0)',
    'fontSize': moderateScale(11)



  },
  'defaultButtonStyle': {
    'borderRadius': 2,
    'paddingHorizontal': 20,
    'paddingVertical': 10,
    'backgroundColor': 'rgba(0,0,0,0)',
    'alignContent': 'center',
    'alignItems': 'center',
    'justifyContent': 'center'
  
  }
};

const Button = ({title, onPress, textStyle, viewStyle, disabled}) => {

  const {defaultButtonStyle, defaultTextStyle} = styles;
  return (
    disabled
      ? <View
        style={[
          defaultButtonStyle,
          viewStyle,
        ]}
        onPress={onPress}
      >
        <Text style={[
          defaultTextStyle,
          textStyle
        ]}>
          {title}
        </Text>
      </View>

      : <TouchableOpacity
        style={[
          defaultButtonStyle,
          viewStyle
        ]}
        onPress={onPress}
      >
        <Text style={[
          defaultTextStyle,
          textStyle
        ]}>
          {title}
        </Text>
      </TouchableOpacity>
  );

};

Button.propTypes = {
  'onPress': PropTypes.func.isRequired,
  'title': PropTypes.string.isRequired,
  'textStyle': Text.propTypes.style,
  'viewStyle': Text.propTypes.style

};

Button.defaultProps = {
  'textStyle': {},
  'viewStyle': {},
  'disabled': false
};

export default Button;

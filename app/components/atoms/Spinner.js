import React from 'react';
import {PropTypes} from 'prop-types';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  'spinnerStyle': {
    'flex': 1,
    'justifyContent': 'center',
    'alignItems': 'center'
  }
});

const Spinner = ({size, style, color}) =>
  <View style={[
    styles.spinnerStyle,
    style
  ]}>
    <ActivityIndicator
      size={size}
      color={color}
    />
  </View>;
Spinner.propTypes = {
  'size': PropTypes.string,
  'style': PropTypes.object,
  'color': PropTypes.string
};

Spinner.defaultProps = {
  'size': 'large',
  'style': {},
  'color': 'gray'
};

export default Spinner;

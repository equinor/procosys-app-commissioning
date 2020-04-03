import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import * as Colors from '../../stylesheets/colors';

const styles = StyleSheet.create({
  'container': {'flex': 1},
  'label': {
    'fontSize': 12,
    'fontStyle': 'italic'
  },
  'text': {
    'color': Colors.GRAY_1,
    'fontSize': 14
  }
});

const SimpleInfoItem = ({item}) =>
  <View style={styles.container}>
    <Text style={styles.label}>{item.label}</Text>
    <Text style={styles.text}>{item.text}</Text>
  </View>;
SimpleInfoItem.propTypes = {
  'item': PropTypes.shape({
    'key': PropTypes.string,
    'label': PropTypes.string,
    'text': PropTypes.string.isRequired
  }).isRequired
};

export default SimpleInfoItem;

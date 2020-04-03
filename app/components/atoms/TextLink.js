import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Colors from '../../stylesheets/colors';

const styles = StyleSheet.create({
  'container': {'flex': 1},
  'linkContainer': {
    'flex': 1,
    'flexDirection': 'row'
  },
  'defaultText': {'flex': 1},
  'icon': {
    'justifyContent': 'flex-end',
    'alignSelf': 'center'
  }
});

const TextLink = ({data, textStyle, nav}) =>
  <TouchableOpacity onPress={() => nav.navigate(data.route)} underlayColor="#00000000" style={styles.container}>
    <View style={styles.linkContainer}>
      <Text style={[
        textStyle,
        styles.defaultText
      ]}>{data.name}</Text>
      <Icon name="ios-arrow-forward" style={styles.icon} size={20} color={Colors.GRAY_2} />
    </View>
  </TouchableOpacity>;
TextLink.propTypes = {
  'data': PropTypes.shape({
    'name': PropTypes.string.isRequired,
    'route': PropTypes.string
  }).isRequired,
  'textStyle': Text.propTypes.style,
  'nav': PropTypes.shape({'state': PropTypes.object}).isRequired
};

TextLink.defaultProps = {'textStyle': {}};

export default TextLink;

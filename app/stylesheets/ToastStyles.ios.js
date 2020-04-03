import { StyleSheet } from 'react-native';
import * as Colors from './colors';

export const base = {
  container: {
    paddingTop: 22,
    paddingRight: 15,
    paddingBottom: 22,
    paddingLeft: 15,
  },
  text: {
    color: Colors.GRAY_1,
  },
};

export default {
  info: StyleSheet.create({
    container: StyleSheet.flatten([base.container, { backgroundColor: Colors.PURPLE_LIGHT }]),
    text: base.text,
  }),
  warning: StyleSheet.create({
    container: StyleSheet.flatten([base.container, { backgroundColor: Colors.YELLOW_LIGHT }]),
    text: base.text,
  }),
  error: StyleSheet.create({
    container: StyleSheet.flatten([base.container, { backgroundColor: Colors.RED }]),
    text: base.text,
  }),
};

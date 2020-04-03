import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {NavigationActions, StackActions} from 'react-navigation';
import Button from '../atoms/Button';
import * as colors from '../../stylesheets/colors';


const styles = StyleSheet.create({
  'container': {
    'flex': 1,
    'margin': 0,
    'padding': 0,
    'justifyContent': 'center',
    'alignItems': 'center'
  },
  'defaultButton': {'backgroundColor': 'white'},
  'buttonText': {
    'color': colors.RED,
    'textAlign': 'right',
    'paddingLeft': 15,
    'paddingRight': 15,
    'fontWeight': '500'
  }
});

class LogoutButton extends Component {

  onButtonClick = () => {
    const {nav} = this.props;
    nav.navigate('LogoutRoute');
  };

  render () {

    const {data} = this.props;
    return (
      <Button
        title={data.text}
        style={styles.container}
        viewStyle={styles.defaultButton}
        textStyle={styles.buttonText}
        onPress={this.onButtonClick}
      />
    );

  }

}

LogoutButton.propTypes = {
  'data': PropTypes.object.isRequired,
  'nav': PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(LogoutButton);

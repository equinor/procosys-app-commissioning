import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TextInput} from 'react-native';

class DelayTextInput extends Component {

  constructor (props) {

    super(props);

    this.state = {'timeout': null};

  }

  render () {

    const {onPauseText, pauseDelay, onChangeText, maxLength} = this.props;
    let {timeout} = this.state;
    return (
      <TextInput
        {...this.props}
         maxLength={this.props.maxLength}

        onChangeText={(text) => {
          if (text !== null && text !== undefined && (!maxLength || text.length <= maxLength)){
            if (onPauseText) {

              if (timeout) {

                window.clearTimeout(timeout);

              }
              timeout = window.setTimeout(() => onPauseText(text), pauseDelay);
              this.setState({timeout});

            }
            if (onChangeText) {

              onChangeText(text);

            }
          }
          }
        }
      />
    );

  }

}

DelayTextInput.propTypes = {
  'onPauseText': PropTypes.func,
  'pauseDelay': PropTypes.number
};

DelayTextInput.defaultProps = {'pauseDelay': 500};

export default DelayTextInput;

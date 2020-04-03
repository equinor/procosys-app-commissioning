import React from 'react';
import {
  View,
} from 'react-native';
import Toast from 'react-native-toaster/src/Toast';
import { connect } from 'react-redux';
import { getToast } from '../reducers/toast';
import ToastStyles from '../stylesheets/ToastStyles'; // eslint-disable-line

const mapStateToProps = state => ({
  message: getToast(state),
});

export const ToastTypes = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
};

const applyStyles = (type) => {
  switch (type) {
    case ToastTypes.WARNING:
      return ToastStyles.waring;
    case ToastTypes.ERROR:
      return ToastStyles.error;
    case ToastTypes.INFO:
    default:
      return ToastStyles.info;
  }
};

let lastToastId = null;
const toastsIdx = [];
const toasts = {};

export default (WrappedComponent) => {
  const WrappedToaster = ({ message }) => {
    if (message && message.id !== lastToastId) {
      if (toastsIdx.indexOf(message.id) < 0) {
        toastsIdx.push(message.id);
        toasts[message.id] = message;
      }
    }


    const toastList = toastsIdx.map((id) => {
      const { text, type } = toasts[id];

      return (<Toast
        key={`toast-${id}`}
        id={id}
        text={text}
        styles={applyStyles(type)}
        duration={type === ToastTypes.ERROR ? 5000 : 3000}
        onShow={() => { lastToastId = id; }}
        onHide={() => {
          toastsIdx.splice(toastsIdx.indexOf(id), 1);
          if (toasts[id]) {
            delete toasts[id];
          }
        }}
      />);
    });
    return toastList;
  };

  return connect(mapStateToProps)((props) => {
    const { message, ...rest } = props;
    return (
      <View style={{ flex: 1 }}>
        <WrappedComponent {...rest} />
        { WrappedToaster({ message }) }
      </View>
    );
  });
};

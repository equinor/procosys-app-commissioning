import { handleActions } from 'redux-actions';

export default handleActions({
  'Connectivity/SET': (state, action) => ({
    ...state,
    connected: action.payload,
  }),
}, { connected: false });


const getConnectivity = state => state.Main.connectivity;

export const getIsConnected = state => getConnectivity(state).connected;
